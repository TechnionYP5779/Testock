import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DbService} from '../../core/db.service';
import {Question, QuestionId} from '../../core/entities/question';
import {SolutionId} from '../../core/entities/solution';
import {AuthService} from '../../core/auth.service';
import {flatMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {TopicWithCreatorId} from '../../core/entities/topic';
import {Course} from '../../core/entities/course';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  private id: string;
  public question: QuestionId;
  public course: Observable<Course>;
  public solutions: SolutionId[];

  topics$: Observable<TopicWithCreatorId[]>;

  adminAccess: boolean;

  constructor(private route: ActivatedRoute, private db: DbService, private auth: AuthService) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.topics$ = this.db.getTopicsForQuestion(this.id);
  }

  ngOnInit() {
    this.db.getQuestion(this.id).subscribe(q => this.getQuestionAndCourse(q));
    this.getSolutions();
    this.db.getQuestion(this.id)
      .pipe(flatMap(q => this.auth.isAdminForCourse(q.course))).subscribe(isAdmin => this.adminAccess = isAdmin);
  }

  private getQuestionAndCourse(q: QuestionId) {
    this.question = q;
    this.course = this.db.getCourse(q.course);
  }

  getSolutions(): void {
    this.db.getSolutions(this.id).subscribe(sol => this.solutions = sol);
  }

}
