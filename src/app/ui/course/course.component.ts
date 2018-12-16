import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../../core/entities/course';
import {DbService} from '../../core/db.service';
import {QuestionId} from '../../core/entities/question';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  public course: Course;
  public id: number;
  public questions: QuestionId[];

  constructor(private route: ActivatedRoute, private db: DbService) {
    this.id = +this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.getCourse();
    this.getQuestions();
  }

  getCourse(): void {
    this.db.getCourse(this.id).subscribe(course => this.course = course);
  }

  getQuestions(): void {
    this.db.getQuestionsOfCourse(this.id).subscribe(questions => this.questions = questions);
  }

}
