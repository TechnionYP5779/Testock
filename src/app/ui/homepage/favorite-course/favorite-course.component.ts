import {Component, Input, OnInit} from '@angular/core';
import {Course} from '../../../entities/course';
import {QuestionId} from '../../../entities/question';
import {map, switchMap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
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
  public solvedQuestionsLimit = 3;
  private _totalSolvedQuestions;

  constructor(private auth: AuthService, private db: DbService) {
    this.solvedQuestions$ = this.auth.user$.pipe(switchMap(userData => {
      if (!userData) {
        return of([]);
      }
      return this.db.getSolvedQuestionsAsQuestions(userData.uid);
    })).pipe(map(questions => {
        const solved = questions.filter(q => q.course === this.course.id);
        this._totalSolvedQuestions = solved.length;
        this.solvedQuestionsLimit = Math.min(3, this._totalSolvedQuestions);
        return solved;
      }));
  }

  ngOnInit() {
  }

  changeSolvedQuestionsLimitBy(delta: number = 3) {
    if (this.solvedQuestionsLimit + delta < 1) {
      this.solvedQuestionsLimit = 1;
      return;
    }
    if (this.solvedQuestionsLimit + delta > this._totalSolvedQuestions) {
      this.solvedQuestionsLimit = this._totalSolvedQuestions;
      return;
    }
    this.solvedQuestionsLimit += delta;
  }
}
