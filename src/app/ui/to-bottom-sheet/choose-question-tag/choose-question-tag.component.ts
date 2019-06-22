import {Component, Input, OnInit} from '@angular/core';
import {Tag} from '@angular/compiler/src/i18n/serializers/xml_helper';
import {Observable} from 'rxjs';
import {MatBottomSheetRef} from '@angular/material';
import {DbService} from '../../../core/db.service';
import {QuestionId} from '../../../entities/question';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-choose-question-tag',
  templateUrl: './choose-question-tag.component.html',
  styleUrls: ['./choose-question-tag.component.scss']
})
export class ChooseQuestionTagComponent implements OnInit {
  @Input() tags: string[];
  @Input() questionId: string;

  constructor(private _bottomSheetRef: MatBottomSheetRef<ChooseQuestionTagComponent>, private db: DbService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
  }

  async chooseTag(tag: string) {
    await this.spinner.show();
    await this.db.addTagToQuestion(this.questionId, tag);
    await this._bottomSheetRef.dismiss();
    await this.spinner.hide();
  }
}
