import { Component, OnInit } from '@angular/core';
import {PdfService} from '../pdf.service';

@Component({
  selector: 'app-pdfjs-test',
  templateUrl: './pdfjs-test.component.html',
  styleUrls: ['./pdfjs-test.component.css']
})
export class PdfjsTestComponent implements OnInit {

  constructor(public pdf: PdfService) { }

  ngOnInit() {
    this.pdf.getImagesOfPDF('assets/test.pdf')
      .then(blobs => console.log(blobs));
  }
}
