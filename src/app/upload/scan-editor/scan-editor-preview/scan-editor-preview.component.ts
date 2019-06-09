import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {QuestionSolution} from '../question-solution';

@Component({
  selector: 'app-scan-editor-preview',
  templateUrl: './scan-editor-preview.component.html',
  styleUrls: ['./scan-editor-preview.component.scss']
})
export class ScanEditorPreviewComponent implements OnInit {

  solutions: QuestionSolution[];
  collapsed: boolean[];

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
