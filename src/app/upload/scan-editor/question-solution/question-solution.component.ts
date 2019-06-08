import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {QuestionSolution} from '../question-solution';

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

  constructor() {}

  ngOnInit() {
  }

  verifyGrade() {
    if (this.sol.grade < 0) {
      this.sol.grade = 0;
    }

    if (this.sol.grade > this.sol.points) {
      this.sol.grade = this.sol.points;
    }
  }
}
