import {Injectable} from '@angular/core';
import {DbService} from '../core/db.service';
import {Exam} from '../entities/exam';
import {Question, QuestionId} from '../entities/question';
import {AngularFireStorage} from '@angular/fire/storage';
import {Solution, SolutionId} from '../entities/solution';
import {first} from 'rxjs/operators';
import {GamificationService, Rewards} from '../gamification/gamification.service';
import {LinkedQuestion, PendingScanId} from '../entities/pending-scan';
import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;
import {OCRService} from '../core/ocr.service';
import {PdfService} from './pdf.service';
import {Moed} from '../entities/moed';
import {ScanDetails} from '../entities/scan-details';
import {QuestionSolution} from './scan-editor/question-solution';
import {ScanPage} from './scan-editor/scan-page';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private db: DbService, private storage: AngularFireStorage,
              private gamification: GamificationService, private ocr: OCRService, private pdf: PdfService) {
  }

  async uploadScan(quickMode: boolean, solutions: QuestionSolution[], pages: ScanPage[], details: ScanDetails): Promise<void> {
    let exam = await this.db.getExamByDetails(details.course, details.moed).pipe(first()).toPromise();

    if (!exam) {
      const e = {} as Exam;
      e.moed = details.moed;
      exam = await this.db.createExamForCourse(details.course, e);
    }

    let pendingScan = null;
    if (quickMode) {
      pendingScan = await this.uploadPendingScan(details.course, details.moed, pages);
    }

    const promises = [];
    for (let i = 0; i < solutions.length; ++i) {
      if (solutions[i].images.length > 0 || quickMode) {
        promises.push(this.uploadQuestion(details.course, details.moed, solutions[i], pendingScan));
      }
    }

    await Promise.all(promises);

    await this.gamification.reward(Rewards.SCAN_UPLOAD);
  }

  async uploadFromPendingScan(solutions: QuestionSolution[], pendingScan: PendingScanId): Promise<void> {

    for (let i = 0; i < solutions.length; ++i) {
      const q = solutions[i];
      const linked = pendingScan.linkedQuestions.find(linkedQuestion => linkedQuestion.num === q.number);
      if (linked) {
        const question = await this.db.getQuestion(linked.qid).pipe(first()).toPromise();
        const sol: SolutionId = {
          id: linked.sid,
          grade: q.grade,
          pendingScanId: pendingScan.id,
          created: Timestamp.now(),
          uploadInProgress: true
        };
        await this.updateSolutionFromPendingScan(question, sol, q.images.map(solImg => solImg.base64));
      } else {
        const sol = await this.uploadQuestion(pendingScan.course, pendingScan.moed, q, null, pendingScan.id);
        const extracted: LinkedQuestion = {
          num: q.number,
          sid: sol.id,
          qid: `${pendingScan.moed.semester.year}-${pendingScan.moed.semester.num}-${pendingScan.moed.num}-${q.number}`
        };
        await this.db.pendingScanAddExtracted(pendingScan.id, extracted);
      }
    }

  }

  private async uploadQuestion(course: number, moed: Moed, solution: QuestionSolution,
                               pendingScan: PendingScanId, preventPendingLink: string = null): Promise<SolutionId> {

    let question = await this.db.getQuestionByDetails(course, moed, solution.number).pipe(first()).toPromise();

    if (!question) {
      const q: Question = {
        course: course,
        moed: moed,
        number: solution.number,
        total_grade: solution.points,
        photo: null,
        created: Timestamp.now(),
        tags: [],
        preventPendingCreationFor: preventPendingLink ? preventPendingLink : null,
        sum_difficulty_ratings: 0,
        count_difficulty_ratings: 0
      };

      question = await this.db.createQuestion(q);
    }
    const sol: Solution = {
      grade: solution.grade,
      uploadInProgress: solution.images.length > 0,
      pendingScanId: solution.images.length === 0 ? pendingScan.id : null,
      created: Timestamp.now()
    };

    const createdSol = await this.db.addSolutionForQuestion(question, sol);

    if (solution.images.length > 0) {
      createdSol.photos = [];
      for (let i = 0; i < solution.images.length; ++i) {
        const p = `${course}\/${moed.semester.year}\/${moed.semester.num}\/${moed.num}\/${solution.number}\/${createdSol.id}\/${i}.jpg`;
        await this.storage.ref(p).putString(solution.images[i].base64, 'data_url');

        createdSol.photos.push(await this.storage.ref(p).getDownloadURL().pipe(first()).toPromise());
      }

      createdSol.uploadInProgress = false;
      await this.db.setSolutionForQuestion(question, createdSol);
    }

    return createdSol;
  }

  private async uploadPendingScan(course: number, moed: Moed, pages: ScanPage[]): Promise<PendingScanId> {

    const createdPendingScan = await this.db.createPendingScan({
      course: course,
      moed: moed,
      pages: [],
      created: Timestamp.now(),
      linkedQuestions: [],
      extractedQuestions: [],
      uploadInProgress: true
    });

    for (let i = 0; i < pages.length; ++i) {
      const p = `${course}\/${moed.semester.year}\/${moed.semester.num}\/${moed.num}\/pending\/${createdPendingScan.id}\/${i}.jpg`;
      await this.storage.ref(p).putString(pages[i].imageBase64, 'data_url');

      createdPendingScan.pages.push(await this.storage.ref(p).getDownloadURL().pipe(first()).toPromise());
    }

    createdPendingScan.uploadInProgress = false;
    await this.db.setPendingScan(createdPendingScan);
    return createdPendingScan;
  }

  public async updateSolutionFromPendingScan(q: QuestionId, sol: SolutionId, photos: string[]): Promise<void> {

    const pendingScanId = sol.pendingScanId;
    sol.pendingScanId = null;
    sol.uploadInProgress = true;
    await this.db.setSolutionForQuestion(q, sol);

    sol.photos = [];

    for (let i = 0; i < photos.length; ++i) {
      const p = `${q.course}\/${q.moed.semester.year}\/${q.moed.semester.num}\/${q.moed.num}\/${q.number}\/${sol.id}\/${i}.jpg`;
      await this.storage.ref(p).putString(photos[i], 'data_url');
      sol.photos.push(await this.storage.ref(p).getDownloadURL().pipe(first()).toPromise());
    }

    sol.uploadInProgress = false;
    await this.db.setSolutionForQuestion(q, sol);

    await this.db.pendingScanAddExtracted(pendingScanId, {qid: q.id, sid: sol.id, num: q.number});

    await this.gamification.reward(Rewards.CROPPED_PENDING_SOLUTION);
  }

  getScanDetailsByFileName(fileName: String): ScanDetails {
    if (/^([0-9]{9}-20[0-9]{2}0([123])-[0-9]{6}-([123]))/.test(fileName.toString())) {
      const split = fileName.split('-');
      const courseId = parseInt(split[2], 10);
      const year = parseInt(split[1].substr(0, 4), 10);
      const semNum = parseInt(split[1].substr(5, 2), 10);
      const moedId = parseInt(split[3], 10);
      return {course: courseId, moed: { semester: {year: year, num: semNum}, num: moedId}};
    } else {
      return null;
    }
  }

  getScanDetailsBySticker(firstPage: Blob): Promise<ScanDetails> {
    return this.ocr.getInfoFromSticker(firstPage);
  }

  /* Batch Upload Method */
  public async uploadPDFFile(scan: File): Promise<PendingScanId> {
    let scanPages: ScanPage[];
    try {
       scanPages = await this.pdf.getScanPagesOfPDF(scan);
    } catch (e) {
      throw new Error('Couldn\'t read PDF file');
    }

    if (scanPages.length === 0) {
      throw new Error('No Images Found');
    }

    let details = this.getScanDetailsByFileName(scan.name);
    if (!details) {
      details = await this.getScanDetailsBySticker(scanPages[0].blob);
      if (!details) {
        throw new Error('Couldn\'t get course details');
      }
    }

    const course = await this.db.getCourse(details.course).pipe(first()).toPromise();
    if (!course) {
      throw new Error('Course doesn\'t exist');
    }

    let exam = await this.db.getExamByDetails(details.course, details.moed).pipe(first()).toPromise();

    if (!exam) {
      const e = {} as Exam;
      e.moed = details.moed;
      exam = await this.db.createExamForCourse(details.course, e);
    }

    const pendingScan = await this.uploadPendingScan(details.course, details.moed, scanPages);

    const questions = await this.db.getQuestionsOfExam(details.course, exam.id).pipe(first()).toPromise();

    for (let i = 0; i < questions.length; ++i) {
      const q = questions[i];
      await this.uploadQuestion(details.course, details.moed, new QuestionSolution(q.number, q.total_grade, true), pendingScan);
    }

    return pendingScan;
  }
}
