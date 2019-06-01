import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {QuestionSolution} from '../scan-editor.component';

@Component({
  selector: 'app-upload-question-new',
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
}