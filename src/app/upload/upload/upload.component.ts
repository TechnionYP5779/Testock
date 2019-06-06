import {Component, HostListener, OnInit} from '@angular/core';
import {DbService} from '../../core/db.service';
import {PdfService} from '../pdf.service';
import {Course} from '../../entities/course';
import {UploadScanProgress, UploadService} from '../upload.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {ActivatedRoute} from '@angular/router';
import {OCRService} from '../../core/ocr.service';
import {take} from 'rxjs/operators';
import {QuestionId} from '../../entities/question';
import {ScanDetails} from '../../entities/scan-details';
import {QuestionSolution} from '../scan-editor/question-solution';
import {FileSystemDirectoryEntry, FileSystemFileEntry, NgxFileDropEntry} from 'ngx-file-drop';
import {ScanPage} from '../scan-editor/scan-page';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ScanDetailsPickerComponent} from '../scan-details-picker/scan-details-picker.component';
import {ScanEditResult} from '../scan-editor/scan-editor.component';

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
  pages: ScanPage[] = null;
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

  scanDetails: ScanDetails;
  course: Course;
  pages: ScanPage[];

  isDragged = false;

  loadProgress: LoadScanProgress;
  error: string;
  uploadProgress: UploadScanProgress;

  constructor(private db: DbService, private pdf: PdfService, private uploadService: UploadService,
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
      this.error = 'Please choose a single PDF file containing your scan';
      return;
    }

    const selectedFileEntry = fileEntries[0];

    this.error = null;
    this.state = UploadState.LoadingFile;

    this.file = await getFile(selectedFileEntry);
    await this.loadFile();
  }

  private getCourse(details: ScanDetails): Promise<Course> {
    return this.db.getCourse(details.course).pipe(take(1)).toPromise();
  }

  loadFile(): Promise<void> {

    this.loadProgress = new LoadScanProgress();
    const filenameDetails: ScanDetails = this.uploadService.getScanDetailsByFileName(this.file.name);
    const pdfPagesExtraction: Promise<ScanPage[]> = this.pdf.getScanPagesOfPDF(this.file).then(pages => {
      if (pages.length === 0) {
        throw new Error('There are no pages in your scan');
      } else {
        return pages;
      }
    });

    pdfPagesExtraction.then(res => this.loadProgress.pages = res);

    let detailsPromise: Promise<ScanDetails>;
    if (filenameDetails) {
      detailsPromise = Promise.resolve(filenameDetails);
    } else {
      detailsPromise = pdfPagesExtraction.then(pages => {
        if (pages.length > 0) {
          return this.uploadService.getScanDetailsBySticker(pages[0].blob);
        } else {
          return null;
        }
      });
    }

    detailsPromise = detailsPromise.then(details => {
      if (details) {
        return details;
      }

      return this.modal.open(ScanDetailsPickerComponent).result.catch(reason => {
        throw new Error('Please provide your scan details');
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

    return Promise.all([detailsPromise, courseDetailsPromise, pdfPagesExtraction, existingQuestionsPromise])
      .then(([details, course, pages, existingQuestions]) => {
        if (existingQuestions) {
          existingQuestions.forEach(q => this.questions.push(new QuestionSolution(q.number, q.total_grade, true)));
        }
        this.scanDetails = details;
        this.course = course;
        this.pages = pages;
        setTimeout(() => this.state = UploadState.Editing, 800);
      }, reason => {
        this.snackBar.open(reason, 'close', {duration: 5000});
        this.error = reason.message;
        this.state = UploadState.Ready;
      });
  }

  uploadScan(editResult: ScanEditResult) {
    this.state = UploadState.Uploading;

    this.uploadService.uploadScan(editResult.quickMode, editResult.solutions, editResult.pages, this.scanDetails)
      .subscribe(progress => {
        this.uploadProgress = progress;
      }, error => {
        this.snackBar.open(error, 'close', {duration: 5000});
        this.error = error.message;
        this.state = UploadState.Ready;
      }, () => {
      this.state = UploadState.UploadSuccess;
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.state === UploadState.Uploading || this.state === UploadState.Editing) {
      $event.returnValue = true;
    }
  }

  reset() {
    this.state = UploadState.Ready;
    this.scanDetails = null;
    this.course = null;
    this.questions = [];
  }
}

function getFile(fileEntry: FileSystemFileEntry): Promise<File> {
  return new Promise<File>((resolve => {
    fileEntry.file((file) => resolve(file));
  }));
}
