import {Component, OnInit, ViewChild} from '@angular/core';
import {DbService} from '../../core/db.service';
import {PdfService} from '../../core/pdf.service';
import {Course} from '../../core/entities/course';
import {UploadService} from '../../core/upload.service';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {FacultyId} from '../../core/entities/faculty';
import {Observable, of} from 'rxjs';
import {flatMap, take} from 'rxjs/operators';
import {async} from 'rxjs/internal/scheduler/async';

class QuestionSolution {
  public index: number;
  public images: string[];
  public grade: number;
  public points: number;

  constructor(index: number) {
    this.index = index;
    this.images = [];
    this.grade = 0;
    this.points = 0;
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

  constructor(private db: DbService, private pdf: PdfService, private uploadService: UploadService, public snackBar: MatSnackBar,
              private route: ActivatedRoute) {
    this.route = route;
  }

  public uploadState = UploadState;

  public course$: Observable<Course>;
  public year: number;
  public semester: number;
  public moed: string;
  public state = UploadState.Ready;
  public faculty$: Observable<FacultyId>;

  ngOnInit() {
    const source = this.route.snapshot.paramMap.get('source')
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

  private getCourseDetails(file: File) {
    const fileName = file.name;
    if (/^([0-9]{9}-20[0-9]{2}0([123])-[0-9]{6}-([123]))/.test(fileName)) {
      const split = fileName.split('-');
      const courseId = parseInt(split[2], 10);
      this.year = parseInt(split[1].substr(0, 4), 10);
      this.semester = parseInt(split[1].substr(5, 2), 10);
      const moedId = parseInt(split[3], 10);
      this.moed = (moedId === 1) ? 'A' : (moedId === 2) ? 'B' : 'C';
      this.course$ = this.db.getCourse(courseId);
      this.faculty$ = this.db.getCourse(courseId).pipe(flatMap(course => {
          if (course.faculty) {
            return this.db.getFaculty(course.faculty);
          } else {
            return of(null);
          }
        })
      );

      // this.db.getCourse(courseId).subscribe(course => {
      //     this.course = course;
      //     this.db.getFaculty(course.faculty).subscribe(faculty => this.faculty = faculty);
      // });

    } else {
      throw new Error('undefined file name!');
    }
  }

  uploadImages() {
    this.state = UploadState.Uploading;

    const sem = (this.semester === 1) ? 'winter' : (this.semester === 2) ? 'spring' : 'summer';
    const moed = this.moed;
    const nums = this.questions.map(q => q.index);
    const grades = this.questions.map(q => q.grade);
    const points = this.questions.map(q => q.points);
    const images = this.questions.map(q => q.images);

    this.course$.pipe(take(1)).toPromise().then(course => {
      this.uploadService.uploadScan(course.id, this.year, sem, moed, nums, grades, points, images)
        .then(() => {
          this.state = UploadState.UploadSuccess;
          this.snackBar.open('Scan for ' + course.name + ' uploaded successfully.', 'close', {duration: 3000});
          this.collapseOneTrigger.nativeElement.click();
          this.resetForm();
        });
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
    this.resetForm();
    try {
      this.getCourseDetails(file);
    } catch (e) {
      this.snackBar.open('Invalid file name', 'close', {duration: 3000});
      return;
    }
    this.questions = [];
    this.pdf.getImagesOfFile(file).then(res => this.blobs = res);
    this.imagesCollpaseTrigger.nativeElement.click();
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

  resetForm() {
    this.questions = [];
    this.blobs = [];
    this.course$ = null;
    this.year = null;
    this.semester = null;
    this.moed = null;
    this.state = UploadState.Ready;
  }
}

