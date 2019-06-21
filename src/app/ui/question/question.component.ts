import {ActivatedRoute, Router} from '@angular/router';
import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {DbService} from '../../core/db.service';
import {QuestionId} from '../../entities/question';
import {SolutionId} from '../../entities/solution';
import {AuthService} from '../../users/auth.service';
import {map, switchMap} from 'rxjs/operators';
import {combineLatest, Observable} from 'rxjs';
import {TopicWithCreatorId} from '../../entities/topic';
import {Course} from '../../entities/course';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SolvedQuestion} from '../../entities/solved-question';
import {NgxSpinnerService} from 'ngx-spinner';
import {MatBottomSheet} from '@angular/material';
import {ChooseQuestionTagComponent} from '../to-bottom-sheet/choose-question-tag/choose-question-tag.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  qId$: Observable<string>;
  question$: Observable<QuestionId>;
  solutions$: Observable<SolutionId[]>;
  topics$: Observable<TopicWithCreatorId[]>;
  course$: Observable<Course>;
  isAdmin$: Observable<boolean>;
  solvedQuestion$: Observable<SolvedQuestion>;
  selected = 0;
  editTotalGrade: number;

  constructor(private route: ActivatedRoute, private db: DbService, private auth: AuthService, private snackBar: MatSnackBar,
              private spinner: NgxSpinnerService, private router: Router, private _bottomSheet: MatBottomSheet, private modal: NgbModal) {
    this.qId$ = this.route.params.pipe(map(params => params.id));
    this.topics$ = this.qId$.pipe(switchMap(qId => this.db.getTopicsForQuestion(qId)));
    this.question$ = this.qId$.pipe(switchMap(qId => this.db.getQuestion(qId)));
    this.solutions$ = this.qId$.pipe(switchMap(qId => this.db.getSolutions(qId)));
    this.course$ = this.qId$.pipe(switchMap(qId => this.db.getQuestion(qId)), switchMap(q => this.db.getCourse(q.course)));
    this.isAdmin$ = this.qId$.pipe(switchMap(qId => this.auth.isAdminForQuestion(qId)));
    this.solvedQuestion$ = this.qId$.pipe(switchMap(qId => this.db.getSolvedQuestion(this.auth.currentUserId, qId)));
  }

  ngOnInit() {}

  async markAsSolved(qId: string) {
    await this.spinner.show();
    await this.db.addSolvedQuestion(this.auth.currentUserId, {linkedQuestionId: qId, difficulty: -1});
    await this.spinner.hide();
    document.getElementById('openModal').click();
  }

  async unmarkAsSolved(qId: string) {
    await this.spinner.show();
    await this.db.deleteSolvedQuestion(this.auth.currentUserId, qId);
    await this.spinner.hide();
    this.snackBar.open(`This question was removed from your solved question list!`, 'close', {duration: 3000});
  }

  arr_diff(a1, a2) {
    if (a1 && a2) {
      return a1.filter(e => !a2.includes(e));
    } else {
      return [];
    }
  }

  async sendRate(qId: string) {
    await this.spinner.show();
    await this.db.addSolvedQuestion(this.auth.currentUserId, {linkedQuestionId: qId, difficulty: this.selected});
    await this.spinner.hide();
    this.snackBar.open(`Difficulty rating sent Successfully!`, 'close', {duration: 3000});
  }

  async removeTag(event: MouseEvent, qId: string, tag: string) {
    event.preventDefault();
    event.stopPropagation();

    await this.spinner.show();
    await this.db.removeTagFromQuestion(qId, tag);
    await this.spinner.hide();
    this.snackBar.open(`Removed Tag Successfully!`, 'close', {duration: 3000});
  }

  async deleteQuestion(qId: string) {
    const courseId = qId.split('-')[0];
    await this.spinner.show();
    await this.router.navigate(['/course/' + courseId]);
    await this.db.removeQuestion(qId);
    await this.spinner.hide();
    this.snackBar.open(`Removed Question Successfully!`, 'close', {duration: 3000});
  }

  openBottomSheet(qId: string, currentTags: string[], availableTags: string[]): void {
    const tagsBottomSheet = this._bottomSheet.open(ChooseQuestionTagComponent);
    tagsBottomSheet.instance.tags = this.arr_diff(availableTags, currentTags);
    tagsBottomSheet.instance.questionId = qId;
  }

  async editQuestion(editQuestionModal: TemplateRef<any>, q: QuestionId) {
    this.editTotalGrade = q.total_grade;
    const result = await this.modal.open(editQuestionModal, {size: 'sm'}).result.catch(reason => {});

    if (result) {

      if (this.editTotalGrade < 1 || this.editTotalGrade > 100) {
        this.snackBar.open('Error: Invalid question grade', 'close', {duration: 3000});
        return;
      }

      q.total_grade = this.editTotalGrade;
      await this.spinner.show();
      await this.db.updateQuestionTotalGrade(q);
      await this.spinner.hide();
      this.snackBar.open('Question updated successfully', 'close', {duration: 3000});
    }
  }
}
