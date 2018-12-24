import {Component, Input, OnInit, Output} from '@angular/core';
import {SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-scan-page',
  templateUrl: './scan-page.component.html',
  styleUrls: ['./scan-page.component.scss']
})
export class ScanPageComponent implements OnInit {

  @Input() private index: number;
  @Input() private blob: Blob;
  @Input() private croppable = false;
  @Output() private selected = false;

  constructor() { }

  ngOnInit() {
  }

}
