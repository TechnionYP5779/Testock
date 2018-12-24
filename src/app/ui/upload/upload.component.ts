import {Component, OnInit, ViewChild} from '@angular/core';
import {DbService} from '../../core/db.service';
import {PdfService} from '../../core/pdf.service';
import {Course} from '../../core/entities/course';
import {UploadService} from '../../core/upload.service';
import {MatSnackBar} from '@angular/material';

class QuestionSolution {
  public index: number;
  public images: string[];
  public grade = 10;

  constructor(index: number) {
    this.index = index;
    this.images = [];
  }

  addImage(image: string) {
    this.images.push(image);
  }
}

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  @ViewChild('file') file;
  @ViewChild('imagesCollpaseTrigger') imagesCollpaseTrigger;

  public questions: QuestionSolution[] = [];
  private activeQuestion = 0;

  public blobs: Blob[];
  private isDragged: boolean;

  constructor(private db: DbService, private pdf: PdfService, private uploadService: UploadService, public snackBar: MatSnackBar) { }

  public course: Course;
  public year: number;
  public semester: number;
  public moed: number;

  ngOnInit() {
  }

  onFileSelected() {
    const file = this.file.nativeElement.files[0];
    this.loadFile(file);
  }

  private tryGetCourseDetails(file: File) {
    const fileName = file.name;
    const split = fileName.split('-');
    const courseId = parseInt(split[2], 10);
    this.year = parseInt(split[1].substr(0, 4), 10);
    this.semester = parseInt(split[1].substr(5, 2), 10);
    this.moed = parseInt(split[3], 10);
    this.db.getCourse(courseId).subscribe(course => this.course = course);
  }

  uploadImages() {
    const sem = (this.semester === 1) ? 'winter' : (this.semester === 2) ? 'spring' : 'summer';
    const moed = (this.moed === 1) ? 'A' : (this.moed === 2) ? 'B' : 'C';
    const nums = this.questions.map(q => q.index);
    const grades = this.questions.map(q => q.grade);
    const images = this.questions.map(q => q.images);

    this.uploadService.uploadScan(this.course.id, this.year, sem, moed, nums, grades, images)
      .then(() => console.log('Piiiii'));
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
    this.questions = [];
    this.tryGetCourseDetails(file);
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
}

