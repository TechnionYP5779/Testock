import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as PDFDocument from 'pdfkit';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp(functions.config().firebase);

export class Question {
  public course: number;
  public year: number;
  public moed: string;
  public semester: string;
  public photo: string;
  public number: number;
  public total_grade: number;
}

export class Solution {
  public photo: string;
  public grade: number;
}

export class Course {
  public id: number;
  public name: string;
  public faculty: string;
};

function capStr(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function addQuestion(pdf: PDFDocument, q: Question) {
  pdf.addPage();
  pdf.fontSize(25).text(`Question ${q.number} (${q.total_grade} Points)`, 100, 100);
}

export const getPDFofExam = functions.https.onRequest(async (request, response) => {

  const course = +request.query.course;
  const year = +request.query.year;
  const semester = request.query.semester;
  const moed = request.query.moed;

  if (!course || !year || !semester || !moed) return;

  const courseData = await admin.firestore().collection('courses').doc(course.toString()).get().then(doc => doc.data() as Course);

  const questions = await admin.firestore().collection('questions')
    .where('course', '==', course)
    .where('year', '==', year)
    .where('semester', '==', semester)
    .where('moed', '==', moed)
    .orderBy('number')
    .get().then(docs => {
      return docs.docs.map(snap => snap.data() as Question);
    });

  console.log(`Found ${questions.length} questions for ${course}, ${year}, ${semester}, ${moed}`)

  const pdf = new PDFDocument;

  pdf.pipe(response);

  pdf.fontSize(30).text(`${courseData.id} ${courseData.name}`, { align: 'center' });
  pdf.moveDown(2);
  pdf.fontSize(26).text(`${capStr(semester)} ${year}`, { align: 'center' });
  pdf.moveDown();
  pdf.fontSize(26).text(`Moed ${moed}`, { align: 'center' });

  for (const q of questions) {

    await addQuestion(pdf, q);

  }

  pdf.end();

});
