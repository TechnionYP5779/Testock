import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as https from 'https';
import * as PDFDocument from 'pdfkit';
import * as corsMod from 'cors';
// @ts-ignore
import * as vision from '@google-cloud/vision';
import {Topic} from '../../src/app/entities/topic';
import {UserData} from '../../src/app/entities/user';
import {PendingScan} from '../../src/app/entities/pending-scan';
import {Question, QuestionId} from '../../src/app/entities/question';
import {Solution} from '../../src/app/entities/solution';
import {Course} from '../../src/app/entities/course';
import {SolvedQuestion} from '../../src/app/entities/solved-question';
import FieldValue = admin.firestore.FieldValue;

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript


admin.initializeApp(functions.config().firebase);
const visionClient = new vision.ImageAnnotatorClient();
const cors = corsMod({origin: true});

const DOMINANT_FRACTION_THRESHOLD = 0.88;
const TEXT_SCORE_THRESHOLD = 0.95;

function matchInArray(regex: RegExp, arrayOfString: string[]): string {

  const len = arrayOfString.length;
  let i = 0;

  for (; i < len; i++) {
    if (arrayOfString[i].match(regex)) {
      return arrayOfString[i];
    }
  }
  return '';
}

export const onTagDeleted = functions.firestore.document('courses/{courseID}').onUpdate(async (change, context) => {
  const prev_data = change.before.data();
  const new_data = change.after.data();
  const prev_tags: string[] = prev_data ? prev_data.tags : [];
  const new_tags: string[] = new_data ? new_data.tags : [];
  return Promise.all(prev_tags.filter(tag => !new_tags.includes(tag)).map( async tag => {
    const snapshot = await admin.firestore().collection('questions').where('course', '==', parseInt(context.params.courseID)).get();
    return snapshot.docs.map(doc => {
      return doc.ref.update({'tags': FieldValue.arrayRemove(tag)});
      });
    }));
});

export const isImageBlank = functions.https.onRequest(async (request, response) => {
  return cors(request, response, async () => {
    const [imagePropertiesResult] = await visionClient.imageProperties(request.body);
    const [labelDetectionResult] = await visionClient.labelDetection(request.body);
    const dominantColorFraction = imagePropertiesResult.imagePropertiesAnnotation.dominantColors.colors[0]['score'];
    // @ts-ignore
    const textlLabel = labelDetectionResult.labelAnnotations.filter(label => label['description'] === 'Text');
    if (dominantColorFraction > DOMINANT_FRACTION_THRESHOLD && (textlLabel.length < 1
      || textlLabel[0]['score'] < TEXT_SCORE_THRESHOLD)) {
      response.status(200).send( {isBlank: true});
    } else {
      response.status(200).send( {isBlank: false});
    }
  });
});

export const getStickerInfoFromTitlePage = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    const [result]= await visionClient.textDetection(request.body);
    // @ts-ignore
    const detections = result.textAnnotations.map(val => val['description']);

    let possibleRegex: RegExp[];
    possibleRegex = [/^[/\d]{4}[.][/\d]{2}[-][/\d]{6}[-][/\d]$/,
      /^[/\d]{7}[.][/\d]{2}[-][/\d]{6}[-][/\d]$/,
      /^[/\d]{4}[.][/\d]{2}[-][/\d]{6}[-][/\d]{3}[.][/\d]{2}[.][/\d]{2}$/];

    const matchReg1 = matchInArray(possibleRegex[0], detections);
    const matchReg2 = matchInArray(possibleRegex[1], detections);
    const matchReg3 = matchInArray(possibleRegex[2], detections);

    let infoStr = '';
    if (matchReg1 !== '') {
      infoStr = matchReg1.toString();
    } else if (matchReg2 !== '') {
      infoStr = matchReg2.toString().substring(3);
    } else if (matchReg3 !== ''){
      infoStr = matchReg3.toString().substring(0, 16);
    }

    const year = infoStr.substr(0, 4);
    const semester = infoStr.substr(5, 2);
    const number = infoStr.substr(8, 6);
    const moed = infoStr.substr(15, 1);

    response.status(200).send({
      year: year,
      semester: semester,
      course: number,
      moed: moed
    });
  });
});


const bucket = admin.storage().bucket();

function capStr(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function addSolImage(pdf: PDFKit.PDFDocument, url: string){
  return new Promise(async(resolve, reject) => {
    const req = await https.get(url, (res) => {
      res.setEncoding('base64');
      let body = "data:" + res.headers["content-type"] + ";base64,";
      res.on('data', (d) => {
        body += d;
      });
      res.on('end', () => {
        pdf.image(body, { width: 500, align: 'center' } as PDFKit.Mixins.ImageOption);
        resolve(res);
      });
    });
    req.on('error', err => {
      console.error('error!');
      reject(err);
    });

  });

}

async function getBestSolutionFor(q: QuestionId): Promise<Solution|null> {
  const query = admin.firestore().collection(`questions/${q.id}/solutions`).where('pendingScanId', '==', null).orderBy('grade', 'desc').limit(1);
  return query.get().then(res => res.docs.length > 0 ? res.docs[0].data() as Solution : null);
}

async function addQuestion(pdf: PDFKit.PDFDocument, q: QuestionId): Promise<void> {
  pdf.addPage();
  const sol = await getBestSolutionFor(q);
  if (sol === null) {
    pdf.fontSize(25).text(`Question ${q.number} (${q.total_grade})`, 50, 50, { link: `https://testock.tk/questions/${q.id}` });
    pdf.moveDown();
    pdf.text(`We don't have any solutions for this question :(`);
    return;
  }
  pdf.fontSize(25).text(`Question ${q.number} (${sol.grade}/${q.total_grade})`, 50, 50, { link: `https://testock.tk/questions/${q.id}` });
  pdf.moveDown();
  let first = true;
  if (!sol || !sol.photos) return;
  for (const photo of sol.photos) {
    if (first) {
      first = false;
    } else {
      pdf.addPage();
      pdf.fontSize(25).text(`Question ${q.number} (Cont.)`, 50, 50, { link: `https://testock.tk/questions/${q.id}` });
    }
    await addSolImage(pdf, photo);
  }
}

async function getQuestionsOfExam(course: number, year: number, semester: string, moed: string): Promise<QuestionId[]> {
  return admin.firestore().collection('questions')
    .where('course', '==', course)
    .where('year', '==', year)
    .where('semester', '==', semester)
    .where('moed', '==', moed)
    .orderBy('number')
    .get().then(docs => {
      return docs.docs.map(snap => {
        return {id: snap.id, ...snap.data() as Question};
      });
    });
}

async function getCourse(course: number): Promise<Course> {
  return admin.firestore().collection('courses').doc(course.toString()).get().then(doc => doc.data() as Course);
}

export const getPDFofExam = functions.https.onRequest(async (request, response) => {

  const course = +request.query.course;
  const year = +request.query.year;
  const semester = request.query.semester;
  const moed = request.query.moed;

  if (!course || !year || !semester || !moed) return;

  const courseData = await getCourse(course);

  console.log(`Getting best scan for course ${courseData.name}`);

  const questions = await getQuestionsOfExam(course, year, semester, moed);

  console.log(`Found ${questions.length} questions for ${course}, ${year}, ${semester}, ${moed}`);

  const pdf = new PDFDocument;

  pdf.pipe(response);

  pdf.fontSize(30).text(`${courseData.id} ${courseData.name}`, { align: 'center', link: `https://testock.tk/course/${courseData.id}` });
  pdf.moveDown(2);
  pdf.fontSize(26).text(`${capStr(semester)} ${year}`, { align: 'center' });
  pdf.moveDown();
  pdf.fontSize(26).text(`Moed ${moed}`, { align: 'center' });
  pdf.moveDown(5);
  pdf.fontSize(20).text('Automatically Generated by Testock', { align: 'center', link: 'https://testock.tk', underline: true });

  for (const q of questions) {
    await addQuestion(pdf, q);
  }

  pdf.end();

});

export const onSolutionDeleted = functions.firestore.document('questions/{questionId}/solutions/{solID}').onDelete(async (snapshot, context) => {

  const qid = context.params.questionId;
  const question: Question = await admin.firestore().doc(`questions/${qid}`).get().then(doc => doc.data() as Question);
  const sid = context.params.solID;
  const sol = snapshot.data();
  const numOfPics = sol && sol.photos ? sol.photos.length : 0;
  const promises = [];
  for (let i=0; i < numOfPics; ++i){
    const path = `${question.course}/${question.year}/${question.semester}/${question.moed}/${question.number}/${sid}/${i}.jpg`;
    promises.push(bucket.file(path).delete());
    console.log(`Deleting ${path}`);
  }

  return Promise.all(promises);
});

async function localAddPoints(userId: string, pointsDelta: number) {
  const document = admin.firestore().collection('users').doc(userId);
  const currentUser = (await document.get()).data();
  if(!currentUser)
    return;

  return document.update({
    points: (currentUser.points ? currentUser.points : 0) + pointsDelta
  });
}

export const addPointsToUser = functions.https.onCall(async (data, context) => {
  if (!context.auth)
    return;

  return localAddPoints(context.auth.uid, data.pointsDelta);
});

export const onTopicChanged = functions.firestore.document('topics/{topicId}').onUpdate(async (change, context) => {
  const pointsDelta = 5;

  const topicBefore = change.before.data();
  const topicAfter = change.after.data();
  if(!topicAfter || !topicBefore)
    return;

  if(topicAfter.correctAnswerId !== '' && topicAfter.correctAnswerId !== topicBefore.correctAnswerId){
    const commentDoc = admin.firestore().collection(`topics/${context.params.topicId}/comments`).doc(topicAfter.correctAnswerId);
    const correctAnswer = (await commentDoc.get()).data();
    if(!correctAnswer)
      return;

    if(topicAfter.creator === correctAnswer.creator)
      return;

    return localAddPoints(correctAnswer.creator, pointsDelta);
  }

  // No points reduction when user's answer is deselected as the correct one, because it was correct at some points :-)
  return;
});

export const onTopicCreated = functions.firestore.document('topics/{topicId}').onCreate((snap, context) => {
  const pointsDelta = 8;

  const topic = snap.data();
  if(!topic)
    return;

  return localAddPoints(topic.creator, pointsDelta);
});

export const onCommentCreated = functions.firestore.document('topics/{topicId}/comments/{commentId}').onCreate(async (snap, context) => {
  const comment = snap.data();
  if (!comment) {
    return
  }

  const commentUser: UserData = await admin.firestore().doc(`users/${comment.creator}`).get().then(doc => doc.data() as UserData);
  const tid = context.params.topicId;
  const topic: Topic = await admin.firestore().doc(`topics/${tid}`).get().then(doc => doc.data() as Topic);

  return admin.firestore().collection('notifications').add({
    content: commentUser.name + ' has commented on your topic: ' + topic.subject,
    datetime: new Date(),
    recipientId: topic.creator,
    seen: false,
    url: 'topic/' + tid
  });
});

export const onPendingScanDeleted = functions.firestore.document('pendingScans/{pid}').onDelete(async (snapshot, context) => {

  const pid = context.params.pid;
  const ps = snapshot.data() as PendingScan;
  const numOfPics = ps ? ps.pages.length : 0;
  const promises = [];
  for (let i=0; i < numOfPics; ++i){
    const path = `${ps.course}/${ps.year}/${ps.semester}/${ps.moed}/pending/${pid}/${i}.jpg`;
    promises.push(bucket.file(path).delete());
    console.log(`Deleting ${path}`);
  }

  return Promise.all(promises);
});

export const onSolvedQuestionUpdate = functions.firestore
  .document('users/{uid}/solvedQuestions/{qid}')
  .onUpdate(async (change, context) => {
    const oldValue = change.before.data() as SolvedQuestion;
    const newValue = change.after.data() as SolvedQuestion;
    if (!oldValue || !newValue) return;
    const oldDifficulty = oldValue.difficulty;
    const newDifficulty = newValue.difficulty;
    if (newDifficulty < 0) {
      return null;
    }
    else if (oldDifficulty < 0) {
      return admin.firestore().collection('questions').doc(context.params.qid).update({
        sum_difficulty_ratings: FieldValue.increment(newDifficulty),
        count_difficulty_ratings: FieldValue.increment(1)
      });
    }
    else {
      return admin.firestore().collection('questions').doc(context.params.qid).update({
        sum_difficulty_ratings: FieldValue.increment(newDifficulty - oldDifficulty)
      });
    }
  });

export const onSolvedQuestionDelete = functions.firestore
  .document('users/{uid}/solvedQuestions/{qid}')
  .onDelete(async (snap, context) => {
    const data = snap.data();
    if (!data) return;
    const difficulty = data.difficulty;
    if (difficulty < 0) {
      return;
    }
    else {
      return admin.firestore().collection('questions').doc(context.params.qid).update({
        sum_difficulty_ratings: FieldValue.increment(-difficulty),
        count_difficulty_ratings: FieldValue.increment(-1)
      });
    }
  });

