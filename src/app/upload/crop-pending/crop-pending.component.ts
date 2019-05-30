import {Component, OnInit, ViewChild} from '@angular/core';
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


export class QuestionSolution {
  public number: number;
  public images: string[];
  public grade: number;
  public points: number;
  public fetchedQuestion: boolean;

  constructor(number: number = 0, points: number = 0) {
    this.images = [];
    this.grade = 0;
    this.number = number;
    this.points = points;
    this.fetchedQuestion = points > 0;
  }

  addImage(image: string) {
    this.images.push(image);
  }

  removeImage(i: number) {
    this.images = this.images.filter((_, index) => index !== i);
  }
}

@Component({
  selector: 'app-crop-pending',
  templateUrl: './crop-pending.component.html',
  styleUrls: ['./crop-pending.component.scss']
})
export class CropPendingComponent implements OnInit {

  @ViewChild('file') file;
  @ViewChild('imagesCollpaseTrigger') imagesCollpaseTrigger;
  @ViewChild('collapseOne') collapseOneTrigger;

  public questions: QuestionSolution[] = [];
  private activeQuestion = null;

  private removedFirstPage = false;
  public allBlobs: Blob[];
  public blobs: Blob[];
  private pendingScanId: string;
  public base64: string[];
  public pendingScan: PendingScanId;

  constructor(private db: DbService, private pdf: PdfService, private ocr: OCRService, private uploadService: UploadService,
              public snackBar: MatSnackBar, private route: ActivatedRoute, private spinner: NgxSpinnerService) {
    this.pendingScanId = this.route.snapshot.paramMap.get('pid');
  }

  public course: CourseWithFaculty;

  ngOnInit() {
    this.loadPendingScan();
    this.questions = [new QuestionSolution()];
  }

  async loadPendingScan() {
    await this.spinner.show();
    this.pendingScan = await this.db.getPendingScan(this.pendingScanId).pipe(take(1)).toPromise();
    this.course = await this.db.getCourseWithFaculty(this.pendingScan.course).pipe(take(1)).toPromise();
    this.blobs = await Promise.all(this.pendingScan.pages.map(page => getBlob(page)));
    this.base64 = await Promise.all(this.blobs.map(blob => getImageBase64(blob)));
    await this.spinner.hide();
  }

  uploadImages() {

  }

  addQuestion() {
    this.questions.push(new QuestionSolution(this.questions.length + 1));
  }

  enableImageAdding(questionIndex: number) {
    this.activeQuestion = questionIndex;
    this.snackBar.open('Select a page to add', 'close', {duration: 3000});
  }

  addImage(image: string) {
    if (image === null) {
      return;
    }

    this.questions[this.activeQuestion - 1].addImage(image);
    this.activeQuestion = 0;
  }

  removeImage(questionImage: any[]) {
    this.questions[questionImage[0] - 1].images.splice(questionImage[1], 1);
    this.activeQuestion = 0;
  }

  removeFirstPage() {
    if (this.removedFirstPage === false) {
      this.blobs = this.blobs.slice(1);
    }
    this.removedFirstPage = true;
  }

  clearEvenPages() {
    const res = [];
    for (let i = 0; i < this.allBlobs.length; i = i + 2) {
      if (i === 0 && this.removedFirstPage) {
        continue;
      }
      res.push(this.allBlobs[i]);
    }

    this.blobs = res;
  }

  clearOddPages() {
    const res = [];
    for (let i = 1; i < this.allBlobs.length; i = i + 2) {
      res.push(this.allBlobs[i]);
    }

    this.blobs = res;
  }

  async clearBlankPages() {
    this.spinner.show();
    const res = [];
    const promises = [];
    for (let i = 0; i < this.allBlobs.length; i = i + 1) {
      promises.push(this.ocr.isImageBlank(this.allBlobs[i]));
    }
    Promise.all(promises).then(isPageBlank => {
      for (let i = 0; i < this.allBlobs.length; i = i + 1) {
        if (!isPageBlank[i].isBlank) {
          res.push(this.allBlobs[i]);
        }
      }
      this.blobs = res;
      this.spinner.hide();
    });
  }

  resetForm() {
    this.questions = [];
    this.blobs = [];
    this.course = null;
  }

  returnPages() {
    this.removedFirstPage = false;
    this.blobs = this.allBlobs;
  }

  removePageByIndex(i: number) {
    this.blobs = this.blobs.filter((v, j) => j !== i);
  }
}

function getBlob(url: string): Promise<Blob> {
  return fetch(url, {mode: 'cors'}).then(res => res.blob());
}

function getImageBase64(blob: Blob): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
