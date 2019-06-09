import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DbService} from '../../core/db.service';
import {QuestionId} from '../../entities/question';
import {SolutionId} from '../../entities/solution';
import {AuthService} from '../../users/auth.service';
import {flatMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {TopicWithCreatorId} from '../../entities/topic';
import {Course} from '../../entities/course';
import { MatSnackBar } from '@angular/material/snack-bar';
import {SolvedQuestion} from '../../entities/solved-question';
import {NgxSpinnerService} from 'ngx-spinner';
import {MatBottomSheet} from '@angular/material';
import {ChooseQuestionTagComponent} from '../to-bottom-sheet/choose-question-tag/choose-question-tag.component';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  qId: string;
  question$: Observable<QuestionId>;
  solutions$: Observable<SolutionId[]>;
  topics$: Observable<TopicWithCreatorId[]>;
  course$: Observable<Course>;
  isAdmin$: Observable<boolean>;
  userId: string;
  solvedQuestion$: Observable<SolvedQuestion>;
  selected = 0;
  average$: number;

  constructor(private route: ActivatedRoute, private db: DbService, private auth: AuthService, private snackBar: MatSnackBar,
              private spinner: NgxSpinnerService, private _bottomSheet: MatBottomSheet) {
    this.qId = this.route.snapshot.paramMap.get('id');
    this.topics$ = this.db.getTopicsForQuestion(this.qId);
    this.question$ = this.db.getQuestion(this.qId);
    this.solutions$ = this.db.getSolutions(this.qId);
    this.isAdmin$ = this.db.getQuestion(this.qId).pipe(flatMap(q => this.auth.isAdminForCourse(q.course)));
    this.course$ = this.db.getQuestion(this.qId).pipe(flatMap(q => this.db.getCourse(q.course)));
    this.userId = this.auth.currentUserId;
    this.solvedQuestion$ = this.db.getSolvedQuestion(this.userId, this.qId);
  }

  ngOnInit() {
  }

  markAsSolved() {
    this.spinner.show();
    this.db.addSolvedQuestion(this.userId, {linkedQuestionId: this.qId, difficulty: -1}).then(() => {
      this.spinner.hide().then(() => {
        document.getElementById('openModal').click();
      });
    });
  }

  unmarkAsSolved() {
    this.spinner.show();
    this.db.deleteSolvedQuestion(this.userId, this.qId).then(() => {
      this.spinner.hide().then(() => {
        this.snackBar.open(`This question was removed from your solved question list!`, 'close', {duration: 3000});
      });
    });
  }

  addTag(tag) {
    this.spinner.show();
    this.db.addTagToQuestion(this.qId, tag).then(() => this.spinner.hide()).then(() => {
      this.snackBar.open(`Added Tag Successfully!`, 'close', {duration: 3000});
    });
  }

  arr_diff(a1, a2) {
    return a1.filter(e => !a2.includes(e));
  }

  sendRate() {
    this.spinner.show();
    this.db.addSolvedQuestion(this.userId, {linkedQuestionId: this.qId, difficulty: this.selected}).then(() =>
      this.spinner.hide()).then(() => {
      this.snackBar.open(`Difficulty rating sent Successfully!`, 'close', {duration: 3000});
    });
  }

  removeTag(event: MouseEvent, tag: string) {
    event.preventDefault();
    event.stopPropagation();

    this.spinner.show();
    this.db.removeTagFromQuestion(this.qId, tag).then(() => this.spinner.hide()).then(() => {
      this.snackBar.open(`Removed Tag Successfully!`, 'close', {duration: 3000});
    });
  }

  openBottomSheet(): void {
    this._bottomSheet.open(ChooseQuestionTagComponent);
  }
}
