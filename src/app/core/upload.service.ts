import { Injectable } from '@angular/core';
import {DbService} from './db.service';
import {Exam} from './entities/exam';
import {Question} from './entities/question';
import {AngularFireStorage} from '@angular/fire/storage';
import {Solution} from './entities/solution';
import {first} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private db: DbService, private storage: AngularFireStorage) {
  }

  async uploadScan(course: number, year: number, semester: string, moed: string,
                   nums: number[], grades: number[], photos: Blob[]): Promise<void> {
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
      promises.push(this.uploadQuestion(course, year, semester, moed, nums[i], grades[i], photos[i]));
    }

    await Promise.all(promises);

  }

  private async uploadQuestion(course: number, year: number, semester: string, moed: string, number: number, grade: number, blob: Blob) {

    let question = await this.db.getQuestionByDetails(course, year, semester, moed, number).pipe(first()).toPromise();

    if (!question) {
      const q = {} as Question;
      q.course = course;
      q.year = year;
      q.semester = semester;
      q.moed = moed;
      q.number = number;
      q.total_grade = 10;

      question = await this.db.createQuestionForExam(course, q);
    }
    const sol = {} as Solution;
    sol.grade = grade;

    const createdSol = await this.db.addSolutionForQuestion(question, sol);

    const path = `${course}\/${year}\/${semester}\/${moed}\/${number}\/${createdSol.id}.jpg`;
    await this.storage.ref(path).put(blob);

    createdSol.photo = await this.storage.ref(path).getDownloadURL().pipe(first()).toPromise();

    await this.db.setSolutionForQuestion(question, createdSol);
  }
}
