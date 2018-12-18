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
      const e = new Exam();
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
      const q = new Question();
      q.course = course;
      q.year = year;
      q.semester = semester;
      q.moed = moed;
      q.number = number;
      q.total_grade = 10;

      question = await this.db.createQuestionForExam(course, q);
    }
    await this.storage.ref(`${course}/${year}/${semester}/${moed}/${number}.jpg`).put(blob);
    console.log('done');
    const sol = new Solution();
    sol.grade = grade;
    sol.photo = await this.storage.ref(`${course}/${year}/${semester}/${moed}/${number}.png`).getDownloadURL().pipe(first()).toPromise();

    await this.db.addSolutionForQuestion(question, sol);
  }
}
