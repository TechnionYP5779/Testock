import {Component, Input, OnInit} from '@angular/core';
import {Tag} from '@angular/compiler/src/i18n/serializers/xml_helper';
import {Observable} from 'rxjs';
import {MatBottomSheetRef} from '@angular/material';
import {DbService} from '../../../core/db.service';
import {QuestionId} from '../../../entities/question';

@Component({
  selector: 'app-choose-question-tag',
  templateUrl: './choose-question-tag.component.html',
  styleUrls: ['./choose-question-tag.component.scss']
})
export class ChooseQuestionTagComponent implements OnInit {
  @Input() tags$: Observable<string[]> = null;
  @Input() questionId: string;

  constructor(private _bottomSheetRef: MatBottomSheetRef<ChooseQuestionTagComponent>, private db: DbService) { }

  ngOnInit() {
  }

  chooseTag(tag: string) {
    this.db.addTagToQuestion(this.questionId, tag).then(() => this._bottomSheetRef.dismiss());
  }
}
