import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DbService} from '../../core/db.service';
import {QuestionId} from '../../entities/question';
import {SolutionId} from '../../entities/solution';
import {AuthService} from '../../users/auth.service';
import {flatMap, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {TopicWithCreatorId} from '../../entities/topic';
import {Course} from '../../entities/course';
import {MatSnackBar} from '@angular/material';
import {SolvedQuestion} from '../../entities/solved-question';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
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

  constructor(private route: ActivatedRoute, private db: DbService, private auth: AuthService, private snackBar: MatSnackBar) {
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
    this.db.addSolvedQuestion(this.userId, {linkedQuestionId: this.qId}).then(() => {
      this.snackBar.open(`This question was added to your solved question list!`, 'close', {duration: 3000});
    });
  }

  unmarkAsSolved() {
    this.db.deleteSolvedQuestion(this.userId, this.qId).then(() => {
      this.snackBar.open(`This question was removed from your solved question list!`, 'close', {duration: 3000});
    });
  }
}
