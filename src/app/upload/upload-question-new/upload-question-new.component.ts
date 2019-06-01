import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {QuestionSolution} from '../scan-editor/scan-editor.component';

@Component({
  selector: 'app-upload-question-new',
  templateUrl: './upload-question-new.component.html',
  styleUrls: ['./upload-question-new.component.scss']
})
export class UploadQuestionNewComponent implements OnInit {

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
