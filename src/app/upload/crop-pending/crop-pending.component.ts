import { Component, OnInit } from '@angular/core';
import {DbService} from '../../core/db.service';
import {OCRService} from '../../core/ocr.service';
import {UploadService} from '../upload.service';
import {ActivatedRoute, Router} from '@angular/router';
import {take} from 'rxjs/operators';
import {NgxSpinnerService} from 'ngx-spinner';
import {PendingScanId} from '../../entities/pending-scan';
import {CourseWithFaculty} from '../../entities/course';
import {ScanPage} from '../scan-editor/scan-page';
import {ScanEditResult} from '../scan-editor/scan-editor.component';
import {QuestionSolution} from '../scan-editor/question-solution';
import {MatSnackBar} from '@angular/material';
import {AppRoutingModule} from '../../app-routing.module';

@Component({
  selector: 'app-crop-pending',
  templateUrl: './crop-pending.component.html',
  styleUrls: ['./crop-pending.component.scss']
})
export class CropPendingComponent implements OnInit {
  pendingScan: PendingScanId;
  course: CourseWithFaculty;
  pages: ScanPage[];
  questions: QuestionSolution[];

  constructor(private db: DbService, private ocr: OCRService, private snackBar: MatSnackBar, private router: Router,
              private uploadService: UploadService, private route: ActivatedRoute, private spinner: NgxSpinnerService) {
    const pendingScanId = this.route.snapshot.paramMap.get('pid');
    this.loadPendingScan(pendingScanId);
  }

  ngOnInit() {
  }

  async loadPendingScan(pendingScanId: string) {
    await this.spinner.show();
    this.pendingScan = await this.db.getPendingScan(pendingScanId).pipe(take(1)).toPromise();
    const fetchedQuestions = await Promise.all(this.pendingScan.linkedQuestions
      .map(linkedQuestion => this.db.getQuestion(linkedQuestion.qid).pipe(take(1)).toPromise()));
    this.questions = fetchedQuestions.map(q => new QuestionSolution(q.number, q.total_grade, true));
    this.course = await this.db.getCourseWithFaculty(this.pendingScan.course).pipe(take(1)).toPromise();
    const blobs = await Promise.all(this.pendingScan.pages.map(page => getBlobFromUrl(page)));
    const base64 = await Promise.all(blobs.map(blob => getImageBase64FromBlob(blob)));
    this.pages = blobs.map((blob, i) => new ScanPage(i + 1, blob, base64[i]));
    await this.spinner.hide();
  }

  async doUpload(editResult: ScanEditResult) {
    await this.spinner.show();
    const solutions = editResult.solutions.filter(sol => sol.images.length > 0);
    await this.uploadService.uploadFromPendingScan(solutions, this.pendingScan);
    await this.spinner.hide();
    const examId = `${this.pendingScan.moed.semester.year}-${this.pendingScan.moed.semester.num}-${this.pendingScan.moed.num}`;
    await this.router.navigate(['/course', this.pendingScan.course, '/exam', examId]);
    this.snackBar.open('Thanks for your contribution!', 'close', {duration: 3000});
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
