import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../../entities/course';
import {DbService} from '../../core/db.service';
import {QuestionId} from '../../entities/question';
import {ExamId} from '../../entities/exam';
import {AuthService} from '../../users/auth.service';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {

  public course: Course;
  public id: number;
  public questions: QuestionId[];
  public exams: ExamId[];
  topics$: Observable<any[]>;
  adminAccess: boolean;

  constructor(private afs: AngularFirestore, private route: ActivatedRoute, private db: DbService, private auth: AuthService) {
    this.id = +this.route.snapshot.paramMap.get('id');
    this.topics$ = this.db.getTopicsForCourseWithCreators(this.id);
  }

  ngOnInit() {
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

}
