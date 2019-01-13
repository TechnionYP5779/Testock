import {Component, Input, OnInit} from '@angular/core';
import {SolutionId} from '../../core/entities/solution';
import {QuestionId} from '../../core/entities/question';
import {DbService} from '../../core/db.service';
import {AuthService} from '../../core/auth.service';

@Component({
  selector: 'app-solution',
  templateUrl: './solution.component.html',
  styleUrls: ['./solution.component.scss']
})
export class SolutionComponent implements OnInit {

  @Input() solution: SolutionId;
  @Input() question: QuestionId;

  @Input()
  adminAccess: boolean;

  constructor(private db: DbService) {
  }

  ngOnInit() {
  }

  deleteSolution(sol: SolutionId): void {
    this.db.deleteSolution(sol, this.question).then(() => console.log('Deleted'));
  }

  saveSolution() {
    this.db.updateSolutionGrade(this.solution, this.question).then(() => console.log('Updated!'));
  }
}
