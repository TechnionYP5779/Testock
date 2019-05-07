import {Injectable} from '@angular/core';
import {DbService} from '../core/db.service';
import {Exam} from '../entities/exam';
import {Question} from '../entities/question';
import {AngularFireStorage} from '@angular/fire/storage';
import {Solution} from '../entities/solution';
import {first} from 'rxjs/operators';
import {GamificationService, Rewards} from '../gamification/gamification.service';
import {PendingScanId} from '../entities/pending-scan';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private db: DbService, private storage: AngularFireStorage, private gamification: GamificationService) {
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
      pages: []
    });

    for (let i = 0; i < pages.length; ++i) {
      const p = `${course}\/${year}\/${semester}\/${moed}\/pending\/${createdPendingScan.id}\/${i}.jpg`;
      await this.storage.ref(p).put(pages[i]);

      createdPendingScan.pages.push(await this.storage.ref(p).getDownloadURL().pipe(first()).toPromise());
    }

    await this.db.setPendingScan(createdPendingScan);
    return createdPendingScan;
  }
}
