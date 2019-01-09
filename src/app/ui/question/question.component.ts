import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DbService} from '../../core/db.service';
import {Question, QuestionId} from '../../core/entities/question';
import {SolutionId} from '../../core/entities/solution';
import {AuthService} from '../../core/auth.service';
import {flatMap} from 'rxjs/operators';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  private id: string;
  public question: QuestionId;
  public solutions: SolutionId[];

  adminAccess: boolean;

  constructor(private route: ActivatedRoute, private db: DbService, private auth: AuthService) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.getQuestion();
    this.getSolutions();
    this.db.getQuestion(this.id)
      .pipe(flatMap(q => this.auth.isAdminForCourse(q.course))).subscribe(isAdmin => this.adminAccess = isAdmin);
  }

  getQuestion(): void {
    this.db.getQuestion(this.id).subscribe(q => this.question = q);

  }

  getSolutions(): void {
    this.db.getSolutions(this.id).subscribe(sol => this.solutions = sol);
  }

  deleteSolution(sol: SolutionId): void {
    this.db.deleteSolution(sol, this.question).then(() => console.log('Deleted'));
  }
}
