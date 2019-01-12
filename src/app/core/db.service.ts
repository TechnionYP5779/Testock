import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from '@angular/fire/firestore';
import {Course} from './entities/course';
import {Observable} from 'rxjs';
import {Question, QuestionId} from './entities/question';
import {Solution, SolutionId} from './entities/solution';
import {flatMap, map} from 'rxjs/operators';
import {Exam, ExamId} from './entities/exam';
import {Roles, UserData} from './entities/user';
import {Faculty, FacultyId} from './entities/faculty';

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
    const order = r =>
      r.where('course', '==', id)
        .orderBy('year', 'desc')
        .orderBy('semester')
        .orderBy('moed')
        .orderBy('number');

    return this.afs.collection<Question>('questions', order).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Question;
        const qid = a.payload.doc.id;
        return {id: qid, ...data};
      }))
    );
  }

  getExamsOfCourse(id: number): Observable<ExamId[]> {

    const order = r =>
      r.orderBy('year', 'desc')
        .orderBy('semester')
        .orderBy('moed');

    return this.coursesCollection.doc<Course>(id.toString()).collection<Exam>('exams', order).snapshotChanges().pipe(
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

  createExamForCourse(course: number, exam: Exam): Promise<ExamId> {
    return this.coursesCollection.doc<Course>(course.toString()).collection('exams').add(exam)
      .then(docRef => {
        return {id: docRef.id, course: course, ...exam};
      });
  }

  getExamByDetails(course: number, year: number, semester: string, moed: string): Observable<ExamId> {

    const ref = r =>
      r.where('year', '==', year)
        .where('semester', '==', semester)
        .where('moed', '==', moed);

    return this.coursesCollection.doc<Course>(course.toString()).collection<Exam>('exams', ref).snapshotChanges().pipe(
      map(actions => {
        if (actions.length !== 1) {
          return null;
        }
        const e = actions[0].payload.doc.data() as Exam;
        return {id: actions[0].payload.doc.id, course: course, ...e};
      })
    );
  }

  getQuestionsOfExam(course: number, examId: string): Observable<QuestionId[]> {

    return this.getExam(course, examId).pipe(
      flatMap(e => {
          const year = e.year;
          const semester = e.semester;
          const moed = e.moed;
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
      })
    );
  }

  getQuestion(id: string): Observable<QuestionId> {
    return this.questionsCollection.doc<Question>(id).valueChanges()
      .pipe(map(q => {
        return {id: id, ...q};
      }));
  }

  getSolutions(questionId: string): Observable<SolutionId[]> {
    return this.afs
      .collection<Solution>('questions/' + questionId + '/solutions', r => r.orderBy('grade', 'desc'))
      .snapshotChanges().pipe(map(actions => actions.map(action => {
        const data = action.payload.doc.data() as Solution;
        const qid = action.payload.doc.id;
        return {id: qid, ...data};
      })));
  }

  get courses(): Observable<Course[]> {
    return this.coursesCollection.valueChanges();
  }

  getQuestionByDetails(course: number, year: number, semester: string, moed: string, number: number): Observable<QuestionId> {
    const ref = r =>
      r.where('course', '==', course)
        .where('year', '==', year)
        .where('semester', '==', semester)
        .where('moed', '==', moed)
        .where('number', '==', number);

    return this.afs.collection<Question>('questions', ref).snapshotChanges().pipe(
      map(actions => {
        if (actions.length !== 1) {
          return null;
        }
        const e = actions[0].payload.doc.data() as Question;
        return {id: actions[0].payload.doc.id, ...e};
      })
    );
  }

  createQuestionForExam(course: number, q: Question): Promise<QuestionId> {
    return this.questionsCollection.add(q)
      .then(docRef => {
        return {id: docRef.id, ...q};
      });
  }

  addSolutionForQuestion(question: QuestionId, sol: Solution): Promise<SolutionId> {
    return this.afs
      .collection<Solution>('questions/' + question.id + '/solutions').add(sol).then(dr => {
        return {id: dr.id, ...sol};
      });
  }

  setSolutionForQuestion(question: QuestionId, sol: SolutionId): Promise<void> {
    return this.afs.doc(`questions/${question.id}/solutions/${sol.id}`).set(sol);
  }

  getAllUsers(): Observable<UserData[]> {
    return this.afs.collection<UserData>('users').valueChanges();
  }

  setUserRoles(uid: string, roles: Roles): Promise<void> {
    return this.afs.doc(`users/${uid}`).set({roles: roles}, {merge: true});
  }

  getFaculties(): Observable<FacultyId[]> {
    return this.afs.collection<Faculty>('faculties').snapshotChanges().pipe(map(actions => actions.map(action => {
      const data = action.payload.doc.data() as Faculty;
      const qid = action.payload.doc.id;
      return {id: qid, ...data};
    })));
  }

  createCourse(course: Course): Promise<void> {
    return this.afs.doc(`courses/${course.id}`).set(course);
  }

  createFaculty(faculty: Faculty): Promise<void> {
    return this.afs.collection<Faculty>('faculties').add(faculty).then((dr) => {});
  }

  deleteSolution(sol: SolutionId, q: QuestionId): Promise<void> {
    return this.afs.doc<Solution>(`questions/${q.id}/solutions/${sol.id}`).delete();
  }

  getUserRoles(uid: string): Observable<Roles> {
    return this.afs.doc<UserData>(`users/${uid}`).valueChanges().pipe(map(u => u.roles));
  }

  getAdminsOfFaculty(faculty: FacultyId): Observable<UserData[]> {
    const ref = r =>
      r.where('roles.faculty_admin', 'array-contains', faculty.id);
    return this.afs.collection<UserData>('users', ref).valueChanges();
  }
}
