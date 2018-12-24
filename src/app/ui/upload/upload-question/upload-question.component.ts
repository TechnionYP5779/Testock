import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-upload-question',
  templateUrl: './upload-question.component.html',
  styleUrls: ['./upload-question.component.scss']
})
export class UploadQuestionComponent implements OnInit {

  @Input() index: number;
  @Input() images: string[] = [];
  @Input() grade: number;
  @Input() points: number;
  @Output() imageAddRequested = new EventEmitter<number>();
  @Output() imageRemoveRequested = new EventEmitter<any[]>();

  constructor() { }

  ngOnInit() {
  }

  requestImageAdd() {
    this.imageAddRequested.emit(this.index);
  }

  removeImage(imageIndex: number) {
    this.imageRemoveRequested.emit([this.index, imageIndex]);
  }
}
