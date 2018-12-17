import {Component, OnInit, ViewChild} from '@angular/core';
import {DbService} from '../../core/db.service';
import {PdfService} from '../../pdf.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Course} from '../../core/entities/course';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  @ViewChild('file') file;

  public images: SafeUrl[];

  constructor(private db: DbService, private pdf: PdfService, private sanitizer: DomSanitizer) { }

  public course: Course;

  ngOnInit() {
  }

  onFileSelected() {
    const file = this.file.nativeElement.files[0];

    this.tryGetCourseDetails(file);

    this.pdf.getImagesOfFile(file).then(res => this.images = res.map(img => {
      const url = URL.createObjectURL(img);
      return this.sanitizer.bypassSecurityTrustUrl(url);
    }));
  }

  removePage(img: SafeUrl) {
    this.images.splice(this.images.indexOf(img), 1);
  }

  private tryGetCourseDetails(file: File) {
    const fileName = file.name;
    const split = fileName.split('-');
    const courseId = parseInt(split[2], 10);
    this.db.getCourse(courseId).subscribe(course => this.course = course);

  }
}
