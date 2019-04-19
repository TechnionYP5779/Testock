import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as https from 'https';
import * as PDFDocument from 'pdfkit';
// @ts-ignore
import * as vision from '@google-cloud/vision';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp(functions.config().firebase);
const visionClient = new vision.ImageAnnotatorClient();

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

export const getStickerInfoFromTitlePage = functions.https.onRequest(async (request, response) => {
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

  response.status(200).send(infoStr);
});


const bucket = admin.storage().bucket();

export interface Question {
  course: number;
  year: number;
  moed: string;
  semester: string;
  photo: string;
  number: number;
  total_grade: number;
}

export interface QuestionId extends Question {
  id: string;
}

export interface Solution {
  photo: string;
  grade: number;
  photos: string[];
}

export interface Course {
  id: number;
  name: string;
  faculty: string;
}

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
  const query = admin.firestore().collection(`questions/${q.id}/solutions`).orderBy('grade', 'desc').limit(1);
  return query.get().then(res => res.docs.length > 0 ? res.docs[0].data() as Solution : null);
}

async function addQuestion(pdf: PDFKit.PDFDocument, q: QuestionId) {
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

export const visionLabelDetection = functions.https.onRequest(async (request, response) => {
  const image = +request.body['image'];
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', 'GET, POST');
  response.status(200);

  if (request.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    response.set('Access-Control-Allow-Methods', 'GET');
    response.set('Access-Control-Allow-Headers', 'Content-Type');
    response.set('Access-Control-Max-Age', '3600');
  }
  // @ts-ignore
  visionClient.labelDetection(image).then(result => response.send(result));
});

export const visionTextDetection = functions.https.onRequest(async (request, response) => {
  const image = +request.body['image'];
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', 'GET, POST');
  response.status(200);

  if (request.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    response.set('Access-Control-Allow-Methods', 'GET');
    response.set('Access-Control-Allow-Headers', 'Content-Type');
    response.set('Access-Control-Max-Age', '3600');
  }
  // @ts-ignore
  visionClient.textDetection(image).then(result => response.send(result));
});

export const visionImageProperties = functions.https.onRequest(async (request, response) => {
  const image = +request.body['image'];
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', 'GET, POST');
  response.status(200);

  if (request.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    response.set('Access-Control-Allow-Methods', 'GET');
    response.set('Access-Control-Allow-Headers', 'Content-Type');
    response.set('Access-Control-Max-Age', '3600');
  }
  // @ts-ignore
  visionClient.imageProperties(image).then(result => response.send(result));
});


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
  const numOfPics = sol ? sol.photos.length : 0;
  const promises = [];
  for (let i=0; i < numOfPics; ++i){
    const path = `${question.course}/${question.year}/${question.semester}/${question.moed}/${question.number}/${sid}/${i}.jpg`;
    promises.push(bucket.file(path).delete());
    console.log(`Deleting ${path}`);
  }

  return Promise.all(promises);
});
