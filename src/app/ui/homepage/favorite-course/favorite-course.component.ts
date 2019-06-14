import {Component, Input, OnInit} from '@angular/core';
import {Course} from '../../../entities/course';
import {Question, QuestionId} from '../../../entities/question';
import {flatMap, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AuthService} from '../../../users/auth.service';
import {DbService} from '../../../core/db.service';

@Component({
  selector: 'app-favorite-course',
  templateUrl: './favorite-course.component.html',
  styleUrls: ['./favorite-course.component.scss']
})
export class FavoriteCourseComponent implements OnInit {

  @Input() course: Course;
  public solvedQuestions$: Observable<QuestionId[]>;
  public solvedQuestionsLimit = 1;

  constructor(private auth: AuthService, private db: DbService) {
    this.solvedQuestions$ = this.auth.user$.pipe(flatMap(userData => this.db.getSolvedQuestionsAsQuestions(userData.uid)))
      .pipe(map(questions => questions.filter(q => q.course === this.course.id)));
  }

  ngOnInit() {
  }

  increaseSolvedQuestionsLimit(delta: number = 3) {
    this.solvedQuestionsLimit += delta;
  }
}
