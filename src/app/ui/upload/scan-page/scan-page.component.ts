import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SafeUrl} from '@angular/platform-browser';
import {ImageCroppedEvent} from 'ngx-image-cropper';

@Component({
  selector: 'app-scan-page',
  templateUrl: './scan-page.component.html',
  styleUrls: ['./scan-page.component.scss']
})
export class ScanPageComponent implements OnInit {

  @Input() private index: number;
  @Input() private blob: Blob;
  @Input() private croppable = false;
  private croppedImage = '';
  @Output() private selected = false;
  @Output() onImageSelected = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  updateCroppedImage(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  cancelImageSelection() {
    this.onImageSelected.emit(null);
  }

  selectImage() {
    this.onImageSelected.emit(this.croppedImage);
  }
}
