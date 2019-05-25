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

export enum PDFUploadResult {
  SUCCESS,
  NO_IMAGES,
  COURSE_DOESNT_EXIST
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private db: DbService, private storage: AngularFireStorage,
              private gamification: GamificationService, private ocr: OCRService, private pdf: PdfService) {
  }

  async uploadScan(quickMode: boolean, pages: Blob[], course: number, year: number, semester: string, moed: string,
                   nums: number[], grades: number[], points: number[], images: string[][]): Promise<void> {
    let exam = await this.db.getExamByDetails(course, year, semester, moed).pipe(first()).toPromise();

    if (!exam) {
      const e = {} as Exam;
      e.moed = moed;
      e.year = year;
      e.semester = semester;
      exam = await this.db.createExamForCourse(course, e);
    }

    let pendingScan = null;
    if (quickMode) {
      pendingScan = await this.uploadPendingScan(course, year, semester, moed, pages);
    }

    const promises = [];
    for (let i = 0; i < nums.length; ++i) {
      if (images[i].length > 0 || quickMode) {
        promises.push(this.uploadQuestion(course, year, semester, moed, nums[i], grades[i], points[i], images[i], pendingScan));
      }
    }

    await Promise.all(promises);

    await this.gamification.reward(Rewards.SCAN_UPLOAD);
  }

  private async uploadQuestion(course: number, year: number, semester: string, moed: string,
                               number: number, grade: number, points: number, images: string[], pendingScan: PendingScanId) {

    let question = await this.db.getQuestionByDetails(course, year, semester, moed, number).pipe(first()).toPromise();

    if (!question) {
      const q = {} as Question;
      q.course = course;
      q.year = year;
      q.semester = semester;
      q.moed = moed;
      q.number = number;
      q.total_grade = points;
      q.tags = [];

      question = await this.db.createQuestionForExam(course, q);
    }
    const sol = {} as Solution;
    sol.grade = grade;

    if (images.length === 0) {
      // If we chose to upload this question and it has 0 photos then it is pending upload..
      sol.pendingScanId = pendingScan.id;
    }

    const createdSol = await this.db.addSolutionForQuestion(question, sol);

    if (images.length > 0) {
      createdSol.photos = [];
      for (let i = 0; i < images.length; ++i) {
        const p = `${course}\/${year}\/${semester}\/${moed}\/${number}\/${createdSol.id}\/${i}.jpg`;
        await this.storage.ref(p).putString(images[i], 'data_url');

        createdSol.photos.push(await this.storage.ref(p).getDownloadURL().pipe(first()).toPromise());
      }

      await this.db.setSolutionForQuestion(question, createdSol);
    }
  }

  private async uploadPendingScan(course: number, year: number, semester: string, moed: string, pages: Blob[]): Promise<PendingScanId> {

    const createdPendingScan = await this.db.createPendingScan({
      course: course,
      year: year,
      moed: moed,
      semester: semester,
      pages: [],
      created: Timestamp.now()
    });

    for (let i = 0; i < pages.length; ++i) {
      const p = `${course}\/${year}\/${semester}\/${moed}\/pending\/${createdPendingScan.id}\/${i}.jpg`;
      await this.storage.ref(p).put(pages[i]);

      createdPendingScan.pages.push(await this.storage.ref(p).getDownloadURL().pipe(first()).toPromise());
    }

    await this.db.setPendingScan(createdPendingScan);
    return createdPendingScan;
  }

  public async updateSolutionFromPendingScan(q: QuestionId, sol: SolutionId, photos: string[]): Promise<void> {

    sol.photos = [];

    for (let i = 0; i < photos.length; ++i) {
      const p = `${q.course}\/${q.year}\/${q.semester}\/${q.moed}\/${q.number}\/${sol.id}\/${i}.jpg`;
      await this.storage.ref(p).putString(photos[i], 'data_url');
      sol.photos.push(await this.storage.ref(p).getDownloadURL().pipe(first()).toPromise());
    }

    sol.pendingScanId = null;

    await this.db.setSolutionForQuestion(q, sol);

    await this.gamification.reward(Rewards.CROPPED_PENDING_SOLUTION);
  }

  /* Batch Upload Method */
  public async uploadPDFFile(scan: File): Promise<string> {
    const images = await this.pdf.getImagesOfFile(scan);
    if (images.length === 0) {
      console.log(`No images for scan ${scan.name}`);
      return 'No images';
    }

    return 'Success';
  }
}
