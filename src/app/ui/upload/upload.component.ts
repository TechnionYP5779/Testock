import {Component, Injectable, OnInit, ViewChild} from '@angular/core';
import {DbService} from '../../core/db.service';
import {PdfService} from '../../core/pdf.service';
import {Course} from '../../core/entities/course';
import {UploadService} from '../../core/upload.service';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {FacultyId} from '../../core/entities/faculty';
import { HttpClient } from '@angular/common/http';
import construct = Reflect.construct;
import {log} from 'util';

@Injectable()
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
@Injectable()
export class UploadComponent implements OnInit {

  @ViewChild('file') file;
  @ViewChild('imagesCollpaseTrigger') imagesCollpaseTrigger;
  @ViewChild('collapseOne') collapseOneTrigger;

  public questions: QuestionSolution[] = [];
  private activeQuestion = 0;

  public blobs: Blob[];
  public isDragged: boolean;
  public http: HttpClient;


  constructor(private db: DbService, private pdf: PdfService, private uploadService: UploadService, public snackBar: MatSnackBar,
              private route: ActivatedRoute, http: HttpClient) {
    this.route = route;
    this.http = http;
  }

  public uploadState = UploadState;

  public course: Course;
  public year: number;
  public semester: number;
  public moed: string;
  public state = UploadState.Ready;
  public faculty: FacultyId;

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

  private matchInArray(regex, expressions) {

    const len = expressions.length;
    let i = 0;

    for (; i < len; i++) {
      if (expressions[i].match(regex)) {
        return expressions[i];
      }
    }

    return '';
  }

  private getCourseDetailsByName(fileName: String){
    if (/^([0-9]{9}-20[0-9]{2}0([123])-[0-9]{6}-([123]))/.test(fileName.toString())) {
      const split = fileName.split('-');
      const courseId = parseInt(split[2], 10);
      this.year = parseInt(split[1].substr(0, 4), 10);
      this.semester = parseInt(split[1].substr(5, 2), 10);
      const moedId = parseInt(split[3], 10);
      this.moed = (moedId === 1) ? 'A' : (moedId === 2) ? 'B' : 'C';
      this.db.getCourse(courseId).subscribe(course => {
        this.course = course;
        this.db.getFaculty(course.faculty).subscribe(faculty => this.faculty = faculty);
      });
    } else {
      throw new Error('undefined file name!');
    }
  }

  private getCourseDetails(file: File) {
    const fileName = file.name;
    try{
      this.getCourseDetailsByName(fileName);
    } catch (e) {
      throw e;
    }
  }

  private getCourseDetailsBySticker(firstPage: Blob) {
    const p = new Promise((resolve, reject) => {
      const reader = new FileReader();
      let base64data: any;
      reader.readAsDataURL(firstPage);
      reader.onloadend = function () {
        base64data = reader.result;
        resolve(base64data);
      };
    });
    p.then(res => {
      const json = {
        'requests': [
          {
            'image': {
              'content': res.toString().substr(23)
            },
            'features': [
              {
                'type': 'TEXT_DETECTION',
                'maxResults': 10000
              }
            ]
          }
        ]
      };
      this.http.post('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBPgqzt5VUAa-Jqc5Qu9DSFcO851rj8p5Q', json)
        .subscribe(result => {
          const info = this.matchInArray(/^[/\d]{4}[.][/\d]{2}[-][/\d]{6}[-][/\d]$/,
            result['responses'][0].textAnnotations.map((val, ind) => val['description']));
        });
    });
  }

  uploadImages() {
    this.state = UploadState.Uploading;

    const sem = (this.semester === 1) ? 'winter' : (this.semester === 2) ? 'spring' : 'summer';
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
    this.resetForm();
    try{
      this.getCourseDetails(file);
    } catch (e) {}
    this.questions = [];
    this.pdf.getImagesOfFile(file).then(res => {
      this.blobs = res;
      this.getCourseDetailsBySticker(this.blobs[0]);
    });
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
    this.course = null;
    this.year = null;
    this.semester = null;
    this.moed = null;
    this.state = UploadState.Ready;
  }
}
