import {Component, OnInit, ViewChild} from '@angular/core';
import {DbService} from '../../core/db.service';
import {PdfService} from '../pdf.service';
import {CourseWithFaculty} from '../../entities/course';
import {ScanDetails, UploadService} from '../upload.service';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {OCRService} from '../../core/ocr.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {take} from 'rxjs/operators';
import {QuestionId} from '../../entities/question';
import {Moed} from '../../entities/moed';


class QuestionSolution {
  public index: number;
  public images: string[];
  public grade: number;
  public points: number;
  public pointsReadOnly: boolean;

  constructor(index: number, points: number = 0) {
    this.index = index;
    this.images = [];
    this.grade = 0;
    this.points = points;
    this.pointsReadOnly = points > 0;
  }

  addImage(image: string) {
    this.images.push(image);
  }
}

enum UploadState {
  Ready,
  Uploading,
  UploadSuccess,
  UploadFailure
}

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  @ViewChild('file') file;
  @ViewChild('imagesCollpaseTrigger') imagesCollpaseTrigger;
  @ViewChild('collapseOne') collapseOneTrigger;

  public questions: QuestionSolution[] = [];
  private activeQuestion = 0;

  private removedFirstPage = false;
  public allBlobs: Blob[];
  public blobs: Blob[];
  public isDragged: boolean;

  constructor(private db: DbService, private pdf: PdfService, private ocr: OCRService, private uploadService: UploadService,
              public snackBar: MatSnackBar, private route: ActivatedRoute, private spinner: NgxSpinnerService) {
    this.route = route;
  }

  public uploadState = UploadState;

  public moed: Moed;
  public state = UploadState.Ready;
  public course: CourseWithFaculty;

  public isQuickMode: boolean;

  ngOnInit() {
    const source = this.route.snapshot.paramMap.get('source');
    if (source) {
      if (source === 'chrome') {
        this.snackBar.open('Drag&Drop your scan from the bottom bar to the upload area', 'close', {duration: 3000});
      }
    }
  }

  onFileSelected(event) {
    const file = this.file.nativeElement.files[0];
    this.loadFile(file);
  }

  private getDetailsByFileName(fileName: String): ScanDetails {
    if (/^([0-9]{9}-20[0-9]{2}0([123])-[0-9]{6}-([123]))/.test(fileName.toString())) {
      const split = fileName.split('-');
      const courseId = parseInt(split[2], 10);
      const year = parseInt(split[1].substr(0, 4), 10);
      const semNum = parseInt(split[1].substr(5, 2), 10);
      const moedId = parseInt(split[3], 10);
      return {course: courseId, moed: { semester: {year: year, num: semNum}, num: moedId}};
    } else {
      return null;
    }
  }

  private getDetailsBySticker(firstPage: Blob): Promise<ScanDetails> {
    return this.ocr.getInfoFromSticker(firstPage).then(details => {
      const semNum = parseInt(details.semester, 10);
      const moedId = parseInt(details.moed, 10);
      const course = parseInt(details.course, 10);
      const year = parseInt(details.year, 10);
      return {course: course, moed: { semester: {year: year, num: semNum}, num: moedId}};
    });
  }

  private getCourseWithFaculty(details: ScanDetails): Promise<CourseWithFaculty> {
    return this.db.getCourseWithFaculty(details.course).pipe(take(1)).toPromise();
  }

  uploadImages() {
    this.state = UploadState.Uploading;

    const moed = this.moed;
    const nums = this.questions.map(q => q.index);
    const grades = this.questions.map(q => q.grade);
    const points = this.questions.map(q => q.points);
    const images = this.questions.map(q => q.images);

    this.uploadService.uploadScan(this.isQuickMode, this.blobs, this.course.id, moed, nums, grades, points, images)
      .then(() => {
        this.state = UploadState.UploadSuccess;
        this.snackBar.open('Scan for ' + this.course.name + ' uploaded successfully.', 'close', {duration: 3000});
        this.collapseOneTrigger.nativeElement.click();
        this.resetForm();
      });
  }

  onDragOver(event): void {
    event.preventDefault();
    this.isDragged = true;
  }

  onDragLeave(event): void {
    this.isDragged = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragged = false;
    const file = event.dataTransfer.items[0].getAsFile();
    this.loadFile(file);
  }

  loadFile(file): void {
    if (!file) {
      this.resetForm();
      return;
    }
    this.spinner.show();
    this.resetForm();

    const filenameDetails: ScanDetails = this.getDetailsByFileName(file.name);
    const pdfImagesExtraction: Promise<Blob[]> = this.pdf.getImagesOfFile(file);

    let detailsPromise: Promise<ScanDetails>;
    if (filenameDetails) {
      detailsPromise = Promise.resolve(filenameDetails);
    } else {
      detailsPromise = pdfImagesExtraction.then(blobs => this.getDetailsBySticker(blobs[0]));
    }

    const courseDetailsPromise: Promise<CourseWithFaculty> = detailsPromise.then(details => this.getCourseWithFaculty(details));
    const existingQuestionsPromise: Promise<QuestionId[]> = detailsPromise
      .then(details => this.db.getExamByDetails(details.course, details.moed).pipe(take(1)).toPromise())
      .then(exam => {
        if (exam) {
          return this.db.getQuestionsOfExam(exam.course, exam.id).pipe(take(1)).toPromise();
        } else {
          return Promise.resolve(null);
        }
      });

    Promise.all([detailsPromise, courseDetailsPromise, pdfImagesExtraction, existingQuestionsPromise])
      .then(([details, courseWithFaculty, blobs, existingQuestions]) => {
        if (existingQuestions) {
          existingQuestions.forEach(q => this.questions.push(new QuestionSolution(q.number, q.total_grade)));
        }
        this.allBlobs = blobs;
        this.blobs = blobs;
        this.moed = details.moed;
        this.course = courseWithFaculty;
        this.imagesCollpaseTrigger.nativeElement.click();
      }, reason => {
        this.snackBar.open(reason, 'close', {duration: 5000});
      })
      .finally(() => this.spinner.hide());
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
    this.moed = null;
    this.state = UploadState.Ready;
  }

  returnPages() {
    this.removedFirstPage = false;
    this.blobs = this.allBlobs;
  }

  removePageByIndex(i: number) {
    this.blobs = this.blobs.filter((v, j) => j !== i);
  }
}
