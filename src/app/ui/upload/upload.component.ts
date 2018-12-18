import {Component, OnInit, ViewChild} from '@angular/core';
import {DbService} from '../../core/db.service';
import {PdfService} from '../../core/pdf.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Course} from '../../core/entities/course';
import {UploadService} from '../../core/upload.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  @ViewChild('file') file;
  @ViewChild('imagesCollpaseTrigger') imagesCollpaseTrigger;

  public images: SafeUrl[];
  public chosenImages: boolean[];
  public questionNums: number[];
  public grades: number[];
  public blobs: Blob[];

  constructor(private db: DbService, private pdf: PdfService, private sanitizer: DomSanitizer, private uploadService: UploadService) { }

  public course: Course;
  public year: number;
  public semester: number;

  ngOnInit() {
  }

  onFileSelected() {
    const file = this.file.nativeElement.files[0];

    this.tryGetCourseDetails(file);

    this.pdf.getImagesOfFile(file).then(res => {
      this.blobs = res;
      this.images = res.map(img => {
        const url = URL.createObjectURL(img);
        return this.sanitizer.bypassSecurityTrustUrl(url);
      });

      this.chosenImages = Array.apply(null, Array(this.images.length)).map(function() { return false; });
      this.questionNums = Array.apply(null, Array(this.images.length)).map(function() { return 0; });
      this.grades = Array.apply(null, Array(this.images.length)).map(function() { return 0; });
    });

    this.imagesCollpaseTrigger.nativeElement.click();
  }

  removePage(img: SafeUrl) {
    this.images.splice(this.images.indexOf(img), 1);
  }

  private tryGetCourseDetails(file: File) {
    const fileName = file.name;
    const split = fileName.split('-');
    const courseId = parseInt(split[2], 10);
    this.year = parseInt(split[1].substr(0, 4), 10);
    this.semester = parseInt(split[1].substr(5, 2), 10);
    this.db.getCourse(courseId).subscribe(course => this.course = course);
  }

  updateImageSelection(i: number) {
    this.chosenImages[i] = !this.chosenImages[i];
  }

  uploadImages() {
    const sem = (this.semester === 1) ? 'winter' : 'spring';
    const nums = this.questionNums.filter((_, index) => this.chosenImages[index]);
    const grades = this.grades.filter((_, index) => this.chosenImages[index]);
    const blobs = this.blobs.filter((_, index) => this.chosenImages[index]);

    this.uploadService.uploadScan(this.course.id, this.year, sem, 'A', nums, grades, blobs)
      .then(() => console.log('Piiiii'));
  }

  addQuestionNumber(i: number, $event: any) {
    this.questionNums[i] = $event.target.value;
  }

  addGrade(i, $event) {
    this.grades[i] = $event.target.value;
  }
}
