import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ScanPage} from '../scan-page';
import {QuestionSolution} from '../question-solution';
import {SolutionImage} from '../solution-image';

@Component({
  selector: 'app-scan-page',
  templateUrl: './scan-page.component.html',
  styleUrls: ['./scan-page.component.scss']
})
export class ScanPageComponent implements OnInit {

  @Input() scanPage: ScanPage;
  @Input() addImageTo: QuestionSolution;
  @Output() hide = new EventEmitter<void>();
  private croppedImage: string;
  private croppedImageSize: number;
  private modal: NgbModalRef;

  constructor(private ngbModal: NgbModal) { }

  ngOnInit() {
  }

  updateCroppedImage(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.croppedImageSize = event.file.size;
  }

  selectImage() {
    if (this.croppedImage) {
      this.scanPage.highlightInc();
      this.addImageTo.addImage(new SolutionImage(this.croppedImage, this.croppedImageSize, this.scanPage));
    }

    this.modal.close();
  }

  openModal(content: any) {
    this.modal = this.ngbModal.open(content, {size: 'lg'});
  }

  addFullPage() {
    if (this.addImageTo) {
      this.scanPage.highlightInc();
      this.addImageTo.addImage(new SolutionImage(this.scanPage.imageBase64, this.scanPage.blob.size, this.scanPage));
    }
  }
}
