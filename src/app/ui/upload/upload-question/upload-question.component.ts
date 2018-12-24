import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-upload-question',
  templateUrl: './upload-question.component.html',
  styleUrls: ['./upload-question.component.scss']
})
export class UploadQuestionComponent implements OnInit {

  @Input() index: number;
  @Input() images: string[] = [];
  @Output() addingEvent = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  addImage() {
    this.addingEvent.emit(this.index);
  }

}
