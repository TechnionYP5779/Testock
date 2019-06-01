import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {QuestionSolution} from '../crop-pending/crop-pending.component';

@Component({
  selector: 'app-upload-question-new',
  templateUrl: './upload-question-new.component.html',
  styleUrls: ['./upload-question-new.component.scss']
})
export class UploadQuestionNewComponent implements OnInit {

  @Input() sol: QuestionSolution;
  @Input() quickMode: boolean;
  collapsed: boolean;

  @Output() imageAddRequested = new EventEmitter<void>();
  @Output() deleteRequested = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {
  }
}
