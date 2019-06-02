import {Injectable} from '@angular/core';
import {DbService} from '../core/db.service';
import {Exam} from '../entities/exam';
import {Question, QuestionId} from '../entities/question';
import {AngularFireStorage} from '@angular/fire/storage';
import {Solution, SolutionId} from '../entities/solution';
import {first} from 'rxjs/operators';
import {GamificationService, Rewards} from '../gamification/gamification.service';
import {PendingScanId} from '../entities/pending-scan';
import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;
import {OCRService} from '../core/ocr.service';
import {PdfService} from './pdf.service';
import {Moed} from '../entities/moed';
import {ScanDetails} from '../entities/scan-details';
import {QuestionSolution} from './scan-editor/question-solution';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private db: DbService, private storage: AngularFireStorage,
              private gamification: GamificationService, private ocr: OCRService, private pdf: PdfService) {
  }

  async uploadScan(quickMode: boolean, pages: Blob[], course: number, moed: Moed,
                   nums: number[], grades: number[], points: number[], images: string[][]): Promise<void> {
    let exam = await this.db.getExamByDetails(course, moed).pipe(first()).toPromise();

    if (!exam) {
      const e = {} as Exam;
      e.moed = moed;
      exam = await this.db.createExamForCourse(course, e);
    }

    let pendingScan = null;
    if (quickMode) {
      pendingScan = await this.uploadPendingScan(course, moed, pages);
    }

    const promises = [];
    for (let i = 0; i < nums.length; ++i) {
      if (images[i].length > 0 || quickMode) {
        promises.push(this.uploadQuestion(course, moed, nums[i], grades[i], points[i], images[i], pendingScan));
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
          pendingScanId: null,
          created: Timestamp.now()
        };
        await this.updateSolutionFromPendingScan(question, sol, q.images);
      } else {
        await this.uploadQuestion(pendingScan.course, pendingScan.moed, q.number, q.grade, q.points, q.images, null, pendingScan.id);
      }
    }

  }

  private async uploadQuestion(course: number, moed: Moed, number: number, grade: number, points: number,
                               images: string[], pendingScan: PendingScanId, preventPendingLink: string = null) {

    let question = await this.db.getQuestionByDetails(course, moed, number).pipe(first()).toPromise();

    if (!question) {
      const q = {} as Question;
      q.course = course;
      q.moed = moed;
      q.number = number;
      q.total_grade = points;
      q.tags = [];
      if (preventPendingLink) {
        q.preventPendingCreationFor = preventPendingLink;
      }

      question = await this.db.createQuestion(q);
    }
    const sol = {} as Solution;
    sol.grade = grade;

    if (images.length === 0) {
      // If we chose to upload this question and it has 0 photos then it is pending upload..
      sol.pendingScanId = pendingScan.id;
    } else {
      sol.pendingScanId = null;
    }

    const createdSol = await this.db.addSolutionForQuestion(question, sol);

    if (images.length > 0) {
      createdSol.photos = [];
      for (let i = 0; i < images.length; ++i) {
        const p = `${course}\/${moed.semester.year}\/${moed.semester.num}\/${moed.num}\/${number}\/${createdSol.id}\/${i}.jpg`;
        await this.storage.ref(p).putString(images[i], 'data_url');

        createdSol.photos.push(await this.storage.ref(p).getDownloadURL().pipe(first()).toPromise());
      }

      await this.db.setSolutionForQuestion(question, createdSol);
    }
  }

  private async uploadPendingScan(course: number, moed: Moed, pages: Blob[]): Promise<PendingScanId> {

    const createdPendingScan = await this.db.createPendingScan({
      course: course,
      moed: moed,
      pages: [],
      created: Timestamp.now(),
      linkedQuestions: []
    });

    for (let i = 0; i < pages.length; ++i) {
      const p = `${course}\/${moed.semester.year}\/${moed.semester.num}\/${moed.num}\/pending\/${createdPendingScan.id}\/${i}.jpg`;
      await this.storage.ref(p).put(pages[i]);

      createdPendingScan.pages.push(await this.storage.ref(p).getDownloadURL().pipe(first()).toPromise());
    }

    await this.db.setPendingScan(createdPendingScan);
    return createdPendingScan;
  }

  public async updateSolutionFromPendingScan(q: QuestionId, sol: SolutionId, photos: string[]): Promise<void> {

    sol.photos = [];

    for (let i = 0; i < photos.length; ++i) {
      const p = `${q.course}\/${q.moed.semester.year}\/${q.moed.semester.num}\/${q.moed.num}\/${q.number}\/${sol.id}\/${i}.jpg`;
      await this.storage.ref(p).putString(photos[i], 'data_url');
      sol.photos.push(await this.storage.ref(p).getDownloadURL().pipe(first()).toPromise());
    }

    sol.pendingScanId = null;

    await this.db.setSolutionForQuestion(q, sol);

    await this.gamification.reward(Rewards.CROPPED_PENDING_SOLUTION);
  }

  private getDetailsByFileName(fileName: String): ScanDetails {
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

  private getDetailsBySticker(firstPage: Blob): Promise<ScanDetails> {
    return this.ocr.getInfoFromSticker(firstPage);
  }

  /* Batch Upload Method */
  public async uploadPDFFile(scan: File): Promise<PendingScanId> {
    let images: Blob[];
    try {
       images = await this.pdf.getImagesOfFile(scan);
    } catch (e) {
      throw new Error('Couldn\'t read PDF file');
    }

    if (images.length === 0) {
      throw new Error('No Images Found');
    }

    let details = this.getDetailsByFileName(scan.name);
    if (!details) {
      details = await this.getDetailsBySticker(images[0]);
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

    const pendingScan = await this.uploadPendingScan(details.course, details.moed, images);

    const questions = await this.db.getQuestionsOfExam(details.course, exam.id).pipe(first()).toPromise();

    for (let i = 0; i < questions.length; ++i) {
      const q = questions[i];
      await this.uploadQuestion(q.course, q.moed, q.number, -1, q.total_grade, [], pendingScan);
    }

    return pendingScan;
  }
}
