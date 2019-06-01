import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {DbService} from '../../core/db.service';
import {PdfService} from '../pdf.service';
import {CourseWithFaculty} from '../../entities/course';
import {UploadService} from '../upload.service';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {OCRService} from '../../core/ocr.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ScanPage} from './scan-page';
import {QuestionSolution} from './question-solution';
import {Moed} from '../../entities/moed';


@Component({
  selector: 'app-scan-editor',
  templateUrl: './scan-editor.component.html',
  styleUrls: ['./scan-editor.component.scss']
})
export class ScanEditorComponent implements OnInit {

  @Input() course: CourseWithFaculty;
  @Input() questions: QuestionSolution[] = [];
  @Input() pages: ScanPage[];
  @Input() moed: Moed;

  activeQuestion: QuestionSolution = null;
  private _hasOcrBlankResults = false;

  constructor(private db: DbService, private pdf: PdfService, private ocr: OCRService, private uploadService: UploadService,
              public snackBar: MatSnackBar, private route: ActivatedRoute, private spinner: NgxSpinnerService, private modal: NgbModal) {
  }

  newQuestionGrade: number;
  newQuestionNum: number;

  ngOnInit() {
  }

  addQuestion(newQuestionModal: TemplateRef<any>) {
    this.newQuestionNum = minNotInArray(this.questions.map(q => q.number));
    this.newQuestionGrade = 5;
    this.modal.open(newQuestionModal, {size: 'sm', centered: true}).result.then(result => {
      if (this.questions.map(q => q.number).includes(this.newQuestionNum)) {
        this.snackBar.open('Question Already Exists', 'close', {duration: 3000});
        return;
      }

      if (this.newQuestionNum <= 0) {
        this.snackBar.open('Invalid question number', 'close', {duration: 3000});
        return;
      }

      if (this.newQuestionGrade <= 0 || this.newQuestionGrade > 100) {
        this.snackBar.open('Invalid question grade', 'close', {duration: 3000});
        return;
      }

      const newQuestion = new QuestionSolution(this.newQuestionNum, this.newQuestionGrade);
      this.questions.push(newQuestion);
      this.questions = this.questions.sort((a, b) => a.number - b.number);
      this.activeQuestion = newQuestion;
    }, reason => {});
  }

  hideFirstPage() {
    if (this.pages && this.pages.length > 0) {
      this.pages[0].hidden = true;
    }
  }

  hideEvenPages() {
    this.pages.filter(page => page.pageNum % 2 === 0).map(page => page.hidden = true);
  }

  hideOddPages() {
    this.pages.filter(page => page.pageNum % 2 === 1).map(page => page.hidden = true);
  }

  async hideBlankPages() {

    if (this._hasOcrBlankResults) {
      this.pages.filter(page => page.ocrBlankResult).map(page => page.hidden = true);
      return;
    }

    await this.spinner.show();
    const promises = this.pages.map(page => this.ocr.isImageBlank(page.blob).then(is => page.ocrBlankResult = is));
    return Promise.all(promises).then(() => {
      this._hasOcrBlankResults = true;
      this.pages.filter(page => page.ocrBlankResult).map(page => page.hidden = true);
      return this.spinner.hide();
    });
  }

  restoreHiddenPages() {
    this.pages.map(page => page.hidden = false);
  }

  activateQuestion(q: QuestionSolution) {
    this.activeQuestion = q;
    this.snackBar.open('Select page to crop solution for question ' + q.number, 'close', {duration: 5000});
  }

  deleteQuestion(q: QuestionSolution) {

    if (this.activeQuestion === q) {
      this.activeQuestion = null;
    }

    this.questions = this.questions.filter(value => value !== q);
  }
}

function minNotInArray(numbers: number[]) {

  if (numbers.length === 0) {
    return 1;
  }

  for (let i = 1; i < Math.max(...numbers); ++i) {
    if (!numbers.includes(i)) {
      return i;
    }
  }

  return Math.max(...numbers) + 1;
}
