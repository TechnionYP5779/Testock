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
  @Output() gradeChange = new EventEmitter<number>();

  @Input() points: number;
  @Output() pointsChange = new EventEmitter<number>();

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

  updateGrade(grade: number) {
    this.grade = +grade;
    this.gradeChange.emit(+grade);
  }

  updatePoints(points: number) {
    this.points = +points;
    this.pointsChange.emit(+points);
  }
}
