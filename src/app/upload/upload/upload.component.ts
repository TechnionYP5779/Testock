import {Component, OnInit} from '@angular/core';
import {DbService} from '../../core/db.service';
import {PdfService} from '../pdf.service';
import {Course} from '../../entities/course';
import {UploadService} from '../upload.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {ActivatedRoute} from '@angular/router';
import {OCRService} from '../../core/ocr.service';
import {take} from 'rxjs/operators';
import {QuestionId} from '../../entities/question';
import {Moed} from '../../entities/moed';
import {ScanDetails} from '../../entities/scan-details';
import {QuestionSolution} from '../scan-editor/question-solution';
import {FileSystemDirectoryEntry, FileSystemFileEntry, NgxFileDropEntry} from 'ngx-file-drop';
import {ScanPage} from '../scan-editor/scan-page';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ScanDetailsPickerComponent} from '../scan-details-picker/scan-details-picker.component';

enum UploadState {
  Ready,
  LoadingFile,
  Editing,
  Uploading,
  UploadSuccess,
  UploadFailure
}

class LoadScanProgress {
  resultScanDetails: ScanDetails = null;
  resultCourse: Course = null;
  existingQuestions: QuestionId[] = null;
  pages: string[] = null;
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
              public snackBar: MatSnackBar, private route: ActivatedRoute, private modal: NgbModal) {
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

  private getCourse(details: ScanDetails): Promise<Course> {
    return this.db.getCourse(details.course).pipe(take(1)).toPromise();
  }

  loadFile(): Promise<void> {

    this.loadProgress = new LoadScanProgress();
    const filenameDetails: ScanDetails = this.uploadService.getScanDetailsByFileName(this.file.name);
    const pdfImagesExtraction: Promise<Blob[]> = this.pdf.getImagesOfFile(this.file);

    let detailsPromise: Promise<ScanDetails>;
    if (filenameDetails) {
      detailsPromise = Promise.resolve(filenameDetails);
    } else {
      detailsPromise = pdfImagesExtraction.then(blobs => this.uploadService.getScanDetailsBySticker(blobs[0]));
    }

    detailsPromise = detailsPromise.then(details => {
      if (details) {
        return Promise.resolve(details);
      }

      return this.modal.open(ScanDetailsPickerComponent).result.then(result => {
        if (result instanceof ScanDetails) {
          return result;
        } else {
          throw new Error(result.error);
        }
      });
    });

    detailsPromise.then(res => this.loadProgress.resultScanDetails = res);

    const courseDetailsPromise: Promise<Course> = detailsPromise.then(details => this.getCourse(details));

    courseDetailsPromise.then(res => this.loadProgress.resultCourse = res);
    const existingQuestionsPromise: Promise<QuestionId[]> = detailsPromise
      .then(details => {
        if (details) {
          return this.db.getExamByDetails(details.course, details.moed).pipe(take(1)).toPromise();
        } else {
          return Promise.resolve(null);
        }
      })
      .then(exam => {
        if (exam) {
          return this.db.getQuestionsOfExam(exam.course, exam.id).pipe(take(1)).toPromise();
        } else {
          return Promise.resolve(null);
        }
      });

    existingQuestionsPromise.then(res => this.loadProgress.existingQuestions = res);

    const base64Promise = pdfImagesExtraction.then(blobs => Promise.all(blobs.map(blob => getImageBase64FromBlob(blob))));
    base64Promise.then(res => this.loadProgress.pages = res);

    return Promise.all([detailsPromise, courseDetailsPromise, pdfImagesExtraction, existingQuestionsPromise, base64Promise])
      .then(([details, course, blobs, existingQuestions, base64]) => {
        if (existingQuestions) {
          existingQuestions.forEach(q => this.questions.push(new QuestionSolution(q.number, q.total_grade, true)));
        }
        this.moed = details.moed;
        this.course = course;
        this.pages = blobs.map((blob, i) => new ScanPage(i + 1, blob, base64[i]));
        setTimeout(() => this.state = UploadState.Editing, 1000);
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
    // this.uploadService.uploadScan(this.isQuickMode, this.blobs, this.resultCourse.id, moed, nums, grades, points, images)
    //   .then(() => {
    //     this.state = UploadState.UploadSuccess;
    //     this.snackBar.open('Scan for ' + this.resultCourse.name + ' uploaded successfully.', 'close', {duration: 3000});
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
