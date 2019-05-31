import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DbService} from '../../core/db.service';
import {PdfService} from '../pdf.service';
import {CourseWithFaculty} from '../../entities/course';
import {UploadService} from '../upload.service';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {OCRService} from '../../core/ocr.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {take} from 'rxjs/operators';
import {PendingScanId} from '../../entities/pending-scan';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';


export class QuestionSolution {
  public number: number;
  public images: string[];
  public grade: number;
  public points: number;
  public fetchedQuestion: boolean;

  constructor(number: number, points: number, fetchedQuestion = false) {
    this.images = [];
    this.grade = 0;
    this.number = number;
    this.points = points;
    this.fetchedQuestion = fetchedQuestion;
  }

  addImage(image: string) {
    this.images.push(image);
  }

  removeImage(i: number) {
    this.images = this.images.filter((_, index) => index !== i);
  }
}

export class ScanPage {
  pageNum: number;
  hidden: boolean;
  blob: Blob;
  imageBase64: string;
  ocrBlankResult: boolean;


  constructor(pageNum: number, image: Blob, imageBase64: string) {
    this.pageNum = pageNum;
    this.blob = image;
    this.imageBase64 = imageBase64;
  }
}

@Component({
  selector: 'app-crop-pending',
  templateUrl: './crop-pending.component.html',
  styleUrls: ['./crop-pending.component.scss']
})
export class CropPendingComponent implements OnInit {

  questions: QuestionSolution[] = [];
  activeQuestion: QuestionSolution = null;

  pendingScan: PendingScanId;
  pages: ScanPage[];

  private _hasOcrBlankResults = false;

  constructor(private db: DbService, private pdf: PdfService, private ocr: OCRService, private uploadService: UploadService,
              public snackBar: MatSnackBar, private route: ActivatedRoute, private spinner: NgxSpinnerService, private modal: NgbModal) {
    const pendingScanId = this.route.snapshot.paramMap.get('pid');
    this.loadPendingScan(pendingScanId);
  }

  public course: CourseWithFaculty;

  ngOnInit() {
    this.questions = [new QuestionSolution(1, 5)];
  }

  async loadPendingScan(pendingScanId: string) {
    await this.spinner.show();
    this.pendingScan = await this.db.getPendingScan(pendingScanId).pipe(take(1)).toPromise();
    this.course = await this.db.getCourseWithFaculty(this.pendingScan.course).pipe(take(1)).toPromise();
    const blobs = await Promise.all(this.pendingScan.pages.map(page => getBlobFromUrl(page)));
    const base64 = await Promise.all(blobs.map(blob => getImageBase64FromBlob(blob)));
    this.pages = blobs.map((blob, i) => new ScanPage(i + 1, blob, base64[i]));
    await this.spinner.hide();
  }

  uploadImages() {

  }

  addQuestion(newQuestionModal: TemplateRef<any>) {
    this.modal.open(newQuestionModal);
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

  imageAddRequested(q: QuestionSolution) {
    this.activeQuestion = q;
    this.snackBar.open('Select page to crop solution for question ' + q.number, 'close', {duration: 5000});
  }
}

function getBlobFromUrl(url: string): Promise<Blob> {
  return fetch(url, {mode: 'cors'}).then(res => res.blob());
}

function getImageBase64FromBlob(blob: Blob): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
