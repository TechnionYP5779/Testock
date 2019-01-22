import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../../core/entities/course';
import {DbService} from '../../core/db.service';
import {QuestionId} from '../../core/entities/question';
import {ExamId} from '../../core/entities/exam';
import {AuthService} from '../../core/auth.service';
import {flatMap, map, switchMap, tap} from 'rxjs/operators';
import {combineLatest, defer, Observable, of} from 'rxjs';
import {TopicId} from '../../core/entities/topic';
import {UserData} from '../../core/entities/user';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  public course: Course;
  public id: number;
  public questions: QuestionId[];
  public exams: ExamId[];
  public topicsLimit: number;
  public questionsLimit: number;
  public examsLimit: number;
  topics$: Observable<any[]>;
  adminAccess: boolean;

  constructor(private afs: AngularFirestore, private route: ActivatedRoute, private db: DbService, private auth: AuthService) {
    this.id = +this.route.snapshot.paramMap.get('id');
    this.topics$ = this.db.getTopicsForCourseWithCreators(this.id);
  }

  ngOnInit() {
    this.topicsLimit = 10;
    this.questionsLimit = 10;
    this.examsLimit = 10;
    this.getCourse();
    this.getQuestions();
    this.getExams();
    this.auth.isAdminForCourse(this.id).subscribe(is => this.adminAccess = is);
  }

  getCourse(): void {
    this.db.getCourse(this.id).subscribe(course => this.course = course);
  }

  getQuestions(): void {
    this.db.getQuestionsOfCourse(this.id).subscribe(questions => this.questions = questions);
  }

  getExams(): void {
    this.db.getExamsOfCourse(this.id).subscribe(exams => this.exams = exams);
  }

  min(a: number, b: number) {
    return Math.min(a, b);
  }

  max(a: number, b: number) {
    return Math.max(a, b);
  }
}
