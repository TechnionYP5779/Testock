import {Component, HostListener, OnInit} from '@angular/core';
import {DbService} from '../../core/db.service';
import {OCRService} from '../../core/ocr.service';
import {UploadScanProgress, UploadService} from '../upload.service';
import {ActivatedRoute, Router} from '@angular/router';
import {take} from 'rxjs/operators';
import {NgxSpinnerService} from 'ngx-spinner';
import {PendingScanId} from '../../entities/pending-scan';
import {Course} from '../../entities/course';
import {ScanPage} from '../scan-editor/scan-page';
import {ScanEditResult} from '../scan-editor/scan-editor.component';
import {QuestionSolution, QuestionType} from '../scan-editor/question-solution';
import {MatSnackBar} from '@angular/material/snack-bar';

enum CropPendingState {
  LoadingFile,
  Editing,
  Uploading,
  UploadSuccess,
  UploadFailure
}

@Component({
  selector: 'app-crop-pending',
  templateUrl: './crop-pending.component.html',
  styleUrls: ['./crop-pending.component.scss']
})
export class CropPendingComponent implements OnInit {
  pendingScan: PendingScanId;
  course: Course;
  pages: ScanPage[];
  questions: QuestionSolution[];
  state: CropPendingState;

  cropState = CropPendingState;
  error: Error;
  hideErrorAlert = false;
  uploadProgress: UploadScanProgress;

  constructor(private db: DbService, private ocr: OCRService, private snackBar: MatSnackBar, private router: Router,
              private uploadService: UploadService, private route: ActivatedRoute, private spinner: NgxSpinnerService) {
    const pendingScanId = this.route.snapshot.paramMap.get('pid');
    this.loadPendingScan(pendingScanId);
  }

  ngOnInit() {
  }

  async loadPendingScan(pendingScanId: string) {
    this.state = this.cropState.LoadingFile;
    this.pendingScan = await this.db.getPendingScan(pendingScanId).pipe(take(1)).toPromise();

    const fetchedQuestions = await Promise.all(this.pendingScan.linkedQuestions
      .map(linkedQuestion => this.db.getQuestion(linkedQuestion.qid).pipe(take(1)).toPromise()));
    const extractedQuestions = await Promise.all(this.pendingScan.extractedQuestions
      .map(extractedQuestion => this.db.getQuestion(extractedQuestion.qid).pipe(take(1)).toPromise()));
    this.questions = fetchedQuestions.map(q => new QuestionSolution(q.number, 0, q.total_grade, QuestionType.FETCHED));
    this.questions = this.questions.concat(
      extractedQuestions.map(q => new QuestionSolution(q.number, 0, q.total_grade, QuestionType.EXTRACTED)));
    this.questions = this.questions.sort((q1, q2) => q1.number - q2.number);

    this.course = await this.db.getCourse(this.pendingScan.course).pipe(take(1)).toPromise();
    const blobs = await Promise.all(this.pendingScan.pages.map(page => getBlobFromUrl(page)));
    const base64 = await Promise.all(blobs.map(blob => getImageBase64FromBlob(blob)));

    this.pages = blobs.map((blob, i) => new ScanPage(i + 1, blob, base64[i]));
    this.state = this.cropState.Editing;
  }

  async doUpload(editResult: ScanEditResult) {
    const solutions = editResult.solutions.filter(sol => sol.images.length > 0);

    if (solutions.length === 0) {
      this.snackBar.open('Please add solution for at least one question to continue', 'close', {duration: 5000});
      return;
    }

    this.state = CropPendingState.Uploading;
    try {
      await this.uploadService.uploadFromPendingScan(progress => {
        this.uploadProgress = progress;
      }, solutions, this.pendingScan);
      this.state = CropPendingState.UploadSuccess;
    } catch (error) {
      this.state = CropPendingState.Editing;
      this.error = error;
      this.hideErrorAlert = false;
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.state === CropPendingState.Editing || this.state === CropPendingState.Uploading) {
      $event.returnValue = true;
    }
  }
}

function getBlobFromUrl(url: string): Promise<Blob> {
  return fetch(url, {mode: 'cors'}).then(res => res.blob());
}

function getImageBase64FromBlob(blob: Blob): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
