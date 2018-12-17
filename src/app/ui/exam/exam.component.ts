import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DbService} from '../../core/db.service';
import {Question, QuestionId} from '../../core/entities/question';
import {Exam} from '../../core/entities/exam';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {

  private courseId: number;
  private examId: string;
  public questions: QuestionId[];ß
  public exam: Exam;

  constructor(private route: ActivatedRoute, private db: DbService) {
    this.courseId = +route.snapshot.paramMap.get('cid');
    this.examId = route.snapshot.paramMap.get('eid');
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
