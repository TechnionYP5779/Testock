import { Injectable } from '@angular/core';
import * as PDFJS from 'pdfjs-dist';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  public async getImagesOfPDF(path: string): Promise<Blob[]> {

    const doc = await PDFJS.getDocument(path);
    const images = [];

    for (let i = 1; i <= doc.numPages; ++i) {
      const page = await doc.getPage(i);
      const ops = await page.getOperatorList();

      for (let j = 0; j < ops.fnArray.length; j++) {
        if (ops.fnArray[j] === PDFJS.OPS.paintJpegXObject) {
          images.push(page.objs.get((ops.argsArray[j][0])));
        }
      }

    }

    const res = [];
    for (let i = 0; i < images.length; ++i) {
      res.push(fetch(images[i].src).then(r => r.blob()));
    }

    return Promise.all(res);

  }
}
