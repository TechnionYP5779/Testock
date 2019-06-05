import {Component, OnInit} from '@angular/core';
import {DbService} from '../../core/db.service';
import {PdfService} from '../pdf.service';
import {Course} from '../../entities/course';
import {UploadService} from '../upload.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {ActivatedRoute} from '@angular/router';
import {OCRService} from '../../core/ocr.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {take} from 'rxjs/operators';
import {QuestionId} from '../../entities/question';
import {Moed} from '../../entities/moed';
import {ScanDetails} from '../../entities/scan-details';
import {QuestionSolution} from '../scan-editor/question-solution';
import {FileSystemDirectoryEntry, FileSystemFileEntry, NgxFileDropEntry} from 'ngx-file-drop';
import {ScanPage} from '../scan-editor/scan-page';

enum UploadState {
  Ready,
  LoadingFile,
  Editing,
  Uploading,
  UploadSuccess,
  UploadFailure
}

class LoadScanProgress {
  doneScanDetails = false;
  doneCourseDetails = false;
  doneExistingQuestions = false;
  doneScanPages = false;
}

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  questions: QuestionSolution[] = [];
  private file: File;

  uploadState = UploadState;
  state = UploadState.Ready;

  moed: Moed;
  course: Course;
  pages: ScanPage[];

  isDragged = false;

  loadProgress: LoadScanProgress;

  constructor(private db: DbService, private pdf: PdfService, private ocr: OCRService, private uploadService: UploadService,
              public snackBar: MatSnackBar, private route: ActivatedRoute) {
    this.route = route;
  }

  ngOnInit() {
    const source = this.route.snapshot.paramMap.get('source');
    if (source) {
      if (source === 'chrome') {
        this.snackBar.open('Drag&Drop your scan from the bottom bar to the upload area', 'close', {duration: 3000});
      }
    }
  }

  async dropped(files: NgxFileDropEntry[]) {
    this.isDragged = false;
    let fileEntries: FileSystemFileEntry[] = [];
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntries.push(fileEntry);
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }

    fileEntries = fileEntries.filter(fe => fe.name.endsWith('.pdf'));

    if (fileEntries.length === 0) {
      return;
    }

    if (fileEntries.length > 1) {
      this.snackBar.open('Please select a single PDF file with your scan', 'close', {duration: 3000});
    }

    const selectedFileEntry = fileEntries[0];

    this.state = UploadState.LoadingFile;

    this.file = await getFile(selectedFileEntry);
    this.loadFile();
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
    return this.ocr.getInfoFromSticker(firstPage);
  }

  private getCourseWithFaculty(details: ScanDetails): Promise<Course> {
    return this.db.getCourse(details.course).pipe(take(1)).toPromise();
  }

  loadFile(): Promise<void> {

    this.loadProgress = new LoadScanProgress();
    const filenameDetails: ScanDetails = this.getDetailsByFileName(this.file.name);
    const pdfImagesExtraction: Promise<Blob[]> = this.pdf.getImagesOfFile(this.file);

    let detailsPromise: Promise<ScanDetails>;
    if (filenameDetails) {
      detailsPromise = Promise.resolve(filenameDetails);
    } else {
      detailsPromise = pdfImagesExtraction.then(blobs => this.getDetailsBySticker(blobs[0]));
    }

    detailsPromise.then(() => this.loadProgress.doneScanDetails = true);

    const courseDetailsPromise: Promise<Course> = detailsPromise.then(details => this.getCourseWithFaculty(details));
    const existingQuestionsPromise: Promise<QuestionId[]> = detailsPromise
      .then(details => this.db.getExamByDetails(details.course, details.moed).pipe(take(1)).toPromise())
      .then(exam => {
        if (exam) {
          return this.db.getQuestionsOfExam(exam.course, exam.id).pipe(take(1)).toPromise();
        } else {
          return Promise.resolve(null);
        }
      });

    const base64Promise = pdfImagesExtraction.then(blobs => Promise.all(blobs.map(blob => getImageBase64FromBlob(blob))));

    return Promise.all([detailsPromise, courseDetailsPromise, pdfImagesExtraction, existingQuestionsPromise, base64Promise])
      .then(([details, course, blobs, existingQuestions, base64]) => {
        if (existingQuestions) {
          existingQuestions.forEach(q => this.questions.push(new QuestionSolution(q.number, q.total_grade)));
        }
        this.moed = details.moed;
        this.course = course;
        this.pages = blobs.map((blob, i) => new ScanPage(i + 1, blob, base64[i]));
        this.state = UploadState.Editing;
      }, reason => {
        this.snackBar.open(reason, 'close', {duration: 5000});
        this.state = UploadState.Ready;
      });
  }

  uploadImages() {
    this.state = UploadState.Uploading;

    // const moed = this.moed;
    // const nums = this.questions.map(q => q.index);
    // const grades = this.questions.map(q => q.grade);
    // const points = this.questions.map(q => q.points);
    // const images = this.questions.map(q => q.images);
    //
    // this.uploadService.uploadScan(this.isQuickMode, this.blobs, this.course.id, moed, nums, grades, points, images)
    //   .then(() => {
    //     this.state = UploadState.UploadSuccess;
    //     this.snackBar.open('Scan for ' + this.course.name + ' uploaded successfully.', 'close', {duration: 3000});
    //   });
  }
}

function getFile(fileEntry: FileSystemFileEntry): Promise<File> {
  return new Promise<File>((resolve => {
    fileEntry.file((file) => resolve(file));
  }));
}

function getImageBase64FromBlob(blob: Blob): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
