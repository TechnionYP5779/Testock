import {Injectable} from '@angular/core';

declare let pdfjsLib: any;
const PDFJS = pdfjsLib;

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  public async getImagesOfPDF(file: string|Uint8Array): Promise<Blob[]> {

    const doc = await PDFJS.getDocument(file);
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

  public async getImagesOfFile(file: File): Promise<Blob[]> {

    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.readAsArrayBuffer(file);
    }).then(res => {
      const data = new Uint8Array(res as ArrayBuffer);
      return this.getImagesOfPDF(data);
    });
  }
}
