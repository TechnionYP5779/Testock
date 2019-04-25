import {Injectable} from '@angular/core';
import {DbService} from '../core/db.service';
import {Exam} from '../entities/exam';
import {Question} from '../entities/question';
import {AngularFireStorage} from '@angular/fire/storage';
import {Solution} from '../entities/solution';
import {first} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private db: DbService, private storage: AngularFireStorage) {
  }

  async uploadScan(course: number, year: number, semester: string, moed: string,
                   nums: number[], grades: number[], points: number[], images: string[][]): Promise<void> {
    let exam = await this.db.getExamByDetails(course, year, semester, moed).pipe(first()).toPromise();

    if (!exam) {
      const e = {} as Exam;
      e.moed = moed;
      e.year = year;
      e.semester = semester;
      exam = await this.db.createExamForCourse(course, e);
    }

    const promises = [];
    for (let i = 0; i < nums.length; ++i) {
      if (images[i].length > 0) {
        promises.push(this.uploadQuestion(course, year, semester, moed, nums[i], grades[i], points[i], images[i]));
      }
    }

    await Promise.all(promises);

  }

  private async uploadQuestion(course: number, year: number, semester: string, moed: string,
                               number: number, grade: number, points: number, images: string[]) {

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

    const createdSol = await this.db.addSolutionForQuestion(question, sol);

    createdSol.photos = [];
    for (let i = 0; i < images.length; ++i) {
      const p = `${course}\/${year}\/${semester}\/${moed}\/${number}\/${createdSol.id}\/${i}.jpg`;
      await this.storage.ref(p).putString(images[i], 'data_url');

      createdSol.photos.push(await this.storage.ref(p).getDownloadURL().pipe(first()).toPromise());
    }

    await this.db.setSolutionForQuestion(question, createdSol);
  }
}
