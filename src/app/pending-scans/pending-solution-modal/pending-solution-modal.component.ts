import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {QuestionId} from '../../entities/question';
import {SolutionId} from '../../entities/solution';
import {DbService} from '../../core/db.service';
import {PendingScanId} from '../../entities/pending-scan';
import {take} from 'rxjs/operators';
import {ImageCroppedEvent} from 'ngx-image-cropper';

@Component({
  selector: 'app-pending-solution-modal',
  templateUrl: './pending-solution-modal.component.html',
  styleUrls: ['./pending-solution-modal.component.scss']
})
export class PendingSolutionModalComponent implements OnInit {

  @Input() question: QuestionId;
  @Input() solution: SolutionId;

  public pendingScan: PendingScanId;
  public cropMode: boolean;
  public isPageCropped: boolean[];
  public pagesBase64: string[];
  public croppedPages: string[];

  constructor(public activeModal: NgbActiveModal, private db: DbService) {
  }

  ngOnInit() {
    this.db.getPendingScan(this.solution.pendingScanId).pipe(take(1)).toPromise().then(ps => {
      this.pendingScan = ps;
      this.isPageCropped = Array(ps.pages.length).map(() => false);
      this.croppedPages = Array(ps.pages.length).map(() => null);
      Promise.all(ps.pages.map(pageUrl => this.getImageBase64(pageUrl))).then(res => this.pagesBase64 = res);
    });
  }

  enableCropMode() {
    this.cropMode = true;
  }

  disableCropMode() {
    this.cropMode = false;
  }

  imageClicked(i: number) {
    if (!this.cropMode) { return; }
    this.isPageCropped[i] = true;
  }

  getImageBase64(url: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const res: any = await fetch(url, {mode: 'cors'});
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  }

  updateCroppedPage(i: number, $event: ImageCroppedEvent) {
    this.croppedPages[i] = $event.base64;
  }

  cancelPage(i: number) {
    this.croppedPages[i] = null;
    this.isPageCropped[i] = false;
  }
}
