import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {QuestionSolution, QuestionType} from '../question-solution';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {SolutionImage} from '../solution-image';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-question-solution',
  templateUrl: './question-solution.component.html',
  styleUrls: ['./question-solution.component.scss']
})
export class QuestionSolutionComponent implements OnInit {

  @Input() sol: QuestionSolution;
  @Input() quickMode: boolean;
  @Input() collapsed: boolean;
  @Input() active: boolean;

  @Output() activateRequested = new EventEmitter<void>();
  @Output() deleteRequested = new EventEmitter<void>();
  @Output() deactivateRequested = new EventEmitter<void>();

  QuestionType = QuestionType;

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {
  }

  verifyGrade() {
    let error = null;
    if (this.sol.grade < 0) {
      this.sol.grade = 0;
      error = 'Grade must be a non-negative number';
    }

    if (this.sol.grade > this.sol.points) {
      this.sol.grade = this.sol.points;
      error = 'Grade can not be greater than question\'s total grade';
    }

    if (error) {
      this.snackBar.open('Error: ' + error, 'close', {duration: 3000});
    }
  }

  solutionImageDropped(event: CdkDragDrop<SolutionImage[]>) {
    moveItemInArray(this.sol.images, event.previousIndex, event.currentIndex);
  }
}
