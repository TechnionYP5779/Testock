import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {QuestionSolution} from '../crop-pending/crop-pending.component';

@Component({
  selector: 'app-upload-scan-page-new',
  templateUrl: './upload-scan-page-new.component.html',
  styleUrls: ['./upload-scan-page-new.component.scss']
})
export class UploadScanPageNewComponent implements OnInit {

  @Input() imageBase64: string;
  @Input() addImageTo: QuestionSolution;
  private croppedImage: string;
  private modal: NgbModalRef;

  constructor(private ngbModal: NgbModal) { }

  ngOnInit() {
  }

  updateCroppedImage(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  selectImage() {
    if (this.croppedImage) {
      this.addImageTo.addImage(this.croppedImage);
    }

    this.modal.close();
  }

  openModal(content: any) {
    this.modal = this.ngbModal.open(content, {size: 'lg'});
  }
}
