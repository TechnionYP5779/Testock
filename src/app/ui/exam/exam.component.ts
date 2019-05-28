import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DbService} from '../../core/db.service';
import {QuestionId} from '../../entities/question';
import {Exam} from '../../entities/exam';
import {AuthService} from '../../users/auth.service';
import {Course} from '../../entities/course';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {

  private courseId: number;
  private examId: string;
  public questions: QuestionId[];
  public exam: Exam;
  course: Course;

  adminAccess: boolean;
  getPdfUrl = 'https://us-central1-' + environment.firebase.projectId + '.cloudfunctions.net/getPDFofExam';

  constructor(private route: ActivatedRoute, private db: DbService, private auth: AuthService) {
    this.courseId = +route.snapshot.paramMap.get('cid');
    this.examId = route.snapshot.paramMap.get('eid');
    this.auth.isAdminForCourse(this.courseId).subscribe(is => this.adminAccess = is);
    this.db.getCourse(this.courseId).subscribe(course => this.course = course);
  }

  ngOnInit() {
    this.getExam();
    this.getQuestions();
  }

  private getQuestions() {
    this.db.getQuestionsOfExam(this.courseId, this.examId).subscribe(ques => this.questions = ques);
  }

  private getExam() {
    this.db.getExam(this.courseId, this.examId).subscribe(exam => this.exam = exam );
  }
}
