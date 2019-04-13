import {Component, Input, OnInit} from '@angular/core';
import {SolutionId} from '../../entities/solution';
import {QuestionId} from '../../entities/question';
import {DbService} from '../../core/db.service';
import {MatSnackBar} from '@angular/material';

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

  constructor(private db: DbService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
  }

  deleteSolution(sol: SolutionId): void {
    this.db.deleteSolution(sol, this.question).then(() => {
      this.snackBar.open(`Solution Deleted Successfully`, 'close', {duration: 3000});
    });
  }

  saveSolution() {
    this.db.updateSolutionGrade(this.solution, this.question).then(() => {
      this.snackBar.open(`Solution Updated Successfully`, 'close', {duration: 3000});
    });
  }
}
