import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {Course} from '../../entities/course';
import { MatSnackBar } from '@angular/material/snack-bar';
import {OCRService} from '../../core/ocr.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ScanPage} from './scan-page';
import {QuestionSolution} from './question-solution';
import {Moed} from '../../entities/moed';
import {ScanEditorPreviewComponent} from './scan-editor-preview/scan-editor-preview.component';

export class ScanEditResult {
  solutions: QuestionSolution[];
  pages: ScanPage[];

  constructor(solutions: QuestionSolution[], pages: ScanPage[]) {
    this.solutions = solutions;
    this.pages = pages;
  }
}

@Component({
  selector: 'app-scan-editor',
  templateUrl: './scan-editor.component.html',
  styleUrls: ['./scan-editor.component.scss']
})
export class ScanEditorComponent implements OnInit {

  @Input() course: Course;
  @Input() questions: QuestionSolution[] = [];
  @Input() pages: ScanPage[];
  @Input() moed: Moed;

  @Output() upload = new EventEmitter<ScanEditResult>();

  activeQuestion: QuestionSolution = null;
  private _hasOcrBlankResults = false;

  constructor(private ocr: OCRService, public snackBar: MatSnackBar, private spinner: NgxSpinnerService, private modal: NgbModal) {
  }

  newQuestionGrade: number;
  newQuestionNum: number;
  hiddenPagesCount = 0;
  pagesPerRow = 2;

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
      this.activateQuestion(newQuestion);
    }, reason => {});
  }

  private hidePage(page: ScanPage) {
    if (!page.hidden) {
      page.hidden = true;
      this.hiddenPagesCount++;
    }
  }

  private restorePage(page: ScanPage) {
    if (page.hidden) {
      page.hidden = false;
      this.hiddenPagesCount--;
    }
  }

  hideFirstPage() {
    if (this.pages && this.pages.length > 0) {
      this.hidePage(this.pages[0]);
    }
  }

  hideEvenPages() {
    this.pages.filter(page => page.pageNum % 2 === 0).map(page => this.hidePage(page));
  }

  hideOddPages() {
    this.pages.filter(page => page.pageNum % 2 === 1).map(page => this.hidePage(page));
  }

  async hideBlankPages() {

    if (this._hasOcrBlankResults) {
      this.pages.filter(page => page.ocrBlankResult).map(page => this.hidePage(page));
      return;
    }

    await this.spinner.show();
    const promises = this.pages.map(page => this.ocr.isImageBlank(page.blob).then(is => page.ocrBlankResult = is));
    return Promise.all(promises).then(() => {
      this._hasOcrBlankResults = true;
      this.pages.filter(page => page.ocrBlankResult).map(page => this.hidePage(page));
      return this.spinner.hide();
    });
  }

  restoreHiddenPages() {
    this.pages.map(page => this.restorePage(page));
  }

  activateQuestion(q: QuestionSolution) {
    if (this.activeQuestion) {
      this.activeQuestion.unhighlightRelatedPages();
    }

    this.activeQuestion = q;
    this.activeQuestion.highlightRelatedPages();
    this.snackBar.open('Select page to crop solution for question ' + q.number, 'close', {duration: 5000});
  }

  deactivateQuestion() {
    if (this.activeQuestion) {
      this.activeQuestion.unhighlightRelatedPages();
      this.activeQuestion = null;
    }
  }

  deleteQuestion(q: QuestionSolution) {

    if (this.activeQuestion === q) {
      this.deactivateQuestion();
    }

    this.questions = this.questions.filter(value => value !== q);
  }

  emitUpload() {
    const result = new ScanEditResult(this.questions, this.pages);
    this.upload.emit(result);
  }

  preview() {
    const ref = this.modal.open(ScanEditorPreviewComponent, {size: 'lg'});
    ref.componentInstance.solutions = this.questions;
    ref.componentInstance.collapsed = this.questions.map(() => true);
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
