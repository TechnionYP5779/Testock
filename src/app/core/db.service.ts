import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Course} from './entities/course';
import {Observable} from 'rxjs';
import {Question, QuestionId} from './entities/question';
import {Solution} from './entities/solution';
import {map} from 'rxjs/operators';
import {Exam, ExamId} from './entities/exam';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  private coursesCollection: AngularFirestoreCollection<Course>;
  private questionsCollection: AngularFirestoreCollection<Question>;
  constructor(private afs: AngularFirestore) {
    this.coursesCollection = afs.collection<Course>('courses');
    this.questionsCollection = afs.collection<Question>('questions');
  }

  getCourse(id: number): Observable<Course> {
    return this.coursesCollection.doc<Course>(id.toString()).valueChanges();
  }

  // Should be deprecated?
  getQuestionsOfCourse(id: number): Observable<QuestionId[]> {
    return this.afs.collection('questions', ref => ref.where('course', '==', id)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Question;
        const qid = a.payload.doc.id;
        return {id: qid, ...data};
      }))
    );
  }

  getExamsOfCourse(id: number): Observable<ExamId[]> {
    return this.coursesCollection.doc<Course>(id.toString()).collection<Exam>('exams').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Exam;
        const eid = a.payload.doc.id;
        return {id: eid, course: id, ...data};
      }))
    );
  }

  getExam(course: number, id: string): Observable<Exam> {
    return this.coursesCollection.doc<Course>(course.toString()).collection<Exam>('exams').doc<Exam>(id).valueChanges();
  }

  getQuestionsOfExam(course: number, year: number, semester: string, moed: string): Observable<QuestionId[]> {
    const ref = r => r
      .where('course', '==', course)
      .where('year', '==', year)
      .where('semester', '==', semester)
      .where('moed', '==', moed)
      .orderBy('number');

    return this.afs.collection('questions', ref).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Question;
        const qid = a.payload.doc.id;
        return {id: qid, ...data};
      }))
    );
  }

  getQuestion(id: string): Observable<Question> {
    return this.questionsCollection.doc<Question>(id).valueChanges();
  }

  getSolutions(questionId: string): Observable<Solution[]> {
    return this.afs.collection<Solution>('questions/' + questionId + '/solutions').valueChanges();
  }

  get courses(): Observable<Course[]> {
    return this.coursesCollection.valueChanges();
  }

}
