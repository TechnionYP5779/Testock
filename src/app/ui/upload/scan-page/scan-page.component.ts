import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SafeUrl} from '@angular/platform-browser';
import {ImageCroppedEvent} from 'ngx-image-cropper';

@Component({
  selector: 'app-scan-page',
  templateUrl: './scan-page.component.html',
  styleUrls: ['./scan-page.component.scss']
})
export class ScanPageComponent implements OnInit {
  @Input() index: number;
  @Input() blob: Blob;
  @Input() croppable = false;
  private croppedImage = '';
  @Output() selected = false;
  @Output() imageSelected = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  updateCroppedImage(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  cancelImageSelection() {
    this.imageSelected.emit(null);
  }

  selectImage() {
    this.imageSelected.emit(this.croppedImage);
  }
}
