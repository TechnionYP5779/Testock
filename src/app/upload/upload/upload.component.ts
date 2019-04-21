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

  public blobs: Blob[];
  public isDragged: boolean;

  constructor(private db: DbService, private pdf: PdfService, private ocr: OCRService, private uploadService: UploadService,
              public snackBar: MatSnackBar, private route: ActivatedRoute, private spinner: NgxSpinnerService) {
    this.route = route;
  }

  public uploadState = UploadState;

  public year: number;
  public semester: string;
  public moed: string;
  public state = UploadState.Ready;
  public course: CourseWithFaculty;

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

  private getDetailsByFileName(fileName: String): Promise<CourseWithFaculty> {
    if (/^([0-9]{9}-20[0-9]{2}0([123])-[0-9]{6}-([123]))/.test(fileName.toString())) {
      const split = fileName.split('-');
      const courseId = parseInt(split[2], 10);
      this.year = parseInt(split[1].substr(0, 4), 10);
      const semNum = parseInt(split[1].substr(5, 2), 10);
      this.semester = semNum === 1 ? 'winter' : semNum === 2 ? 'spring' : 'summer';
      const moedId = parseInt(split[3], 10);
      this.moed = (moedId === 1) ? 'A' : (moedId === 2) ? 'B' : 'C';
      return this.db.getCourseWithFaculty(courseId).pipe(take(1)).toPromise();
    }
    return null;
  }

  private getDetailsFromFile(file: File): Promise<CourseWithFaculty> {
    const fileName = file.name;
    return this.getDetailsByFileName(fileName);
  }

  private getDetailsBySticker(firstPage: Blob): Promise<CourseWithFaculty> {
    return this.ocr.getInfoFromSticker(firstPage).then(info => {
      const year = info.year;
      const semester = info.semester;
      const number = info.course;
      const moed = info.moed;
      const fileName = '000000000-' + year + semester + '-' + number + '-' + moed;
      return fileName;
    }).then(fileName => this.getDetailsByFileName(fileName));
  }

  uploadImages() {
    this.state = UploadState.Uploading;

    const sem = this.semester;
    const moed = this.moed;
    const nums = this.questions.map(q => q.index);
    const grades = this.questions.map(q => q.grade);
    const points = this.questions.map(q => q.points);
    const images = this.questions.map(q => q.images);

    this.uploadService.uploadScan(this.course.id, this.year, sem, moed, nums, grades, points, images)
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
    this.spinner.show();
    this.resetForm();
    this.questions = [];
    const filenameFetching: Promise<CourseWithFaculty> = this.getDetailsFromFile(file);
    const pdfImagesExtraction: Promise<Blob[]> = this.pdf.getImagesOfFile(file).then(res => { this.blobs = res; return res; });

    let courseDetailsPromise: Promise<CourseWithFaculty>;
    if (filenameFetching == null) {
      courseDetailsPromise = pdfImagesExtraction.then(blobs => this.getDetailsBySticker(blobs[0]));
    } else {
      courseDetailsPromise = filenameFetching;
    }

    Promise.all([courseDetailsPromise, pdfImagesExtraction]).then(results => this.course = results[0])
      .then(() => this.db.getExamByDetails(this.course.id, this.year, this.semester, this.moed).pipe(take(1)).toPromise())
      .then(exam => this.db.getQuestionsOfExam(this.course.id, exam.id).pipe(take(1)).toPromise())
      .then(questions => questions.forEach(q => this.questions.push(new QuestionSolution(q.number, q.total_grade))))
      .finally(() => {
        this.imagesCollpaseTrigger.nativeElement.click();
        return this.spinner.hide();
      });
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
    this.blobs = this.blobs.slice(1);
  }

  clearEvenPages() {
    const res = [];
    for (let i = 0; i < this.blobs.length; i = i + 2) {
      res.push(this.blobs[i]);
    }

    this.blobs = res;
  }

  clearOddPages() {
    const res = [];
    for (let i = 1; i < this.blobs.length; i = i + 2) {
      res.push(this.blobs[i]);
    }

    this.blobs = res;
  }

  async clearBlankPages() {
    this.spinner.show();
    const res = [];
    const promises = [];
    for (let i = 0; i < this.blobs.length; i = i + 1) {
      promises.push(this.ocr.isImageBlank(this.blobs[i]));
    }
    Promise.all(promises).then(isPageBlank => {
      for (let i = 0; i < this.blobs.length; i = i + 1) {
        if (!isPageBlank[i].isBlank) {
          res.push(this.blobs[i]);
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
    this.year = null;
    this.semester = null;
    this.moed = null;
    this.state = UploadState.Ready;
  }
}
