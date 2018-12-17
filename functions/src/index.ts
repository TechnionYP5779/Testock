import * as functions from 'firebase-functions';
import * as PDFDocument from 'pdfkit'

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const getPDFofExam = functions.https.onRequest((request, response) => {

  let examId = request.query.examId;
  console.log(examId);
  const doc = new PDFDocument;

  doc.pipe(response);
  doc.addPage()
    .fontSize(25)
    .text('Here is some vector graphics...', 100, 100);

  doc.end()

});
