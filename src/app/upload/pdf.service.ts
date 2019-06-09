import {Injectable} from '@angular/core';
import {ScanPage} from './scan-editor/scan-page';

declare let pdfjsLib: any;
const PDFJS = pdfjsLib;

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  public async getBlobsOfPDF(file: string|Uint8Array): Promise<Blob[]> {

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

  public async getScanPagesOfPDF(file: File): Promise<ScanPage[]> {

    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.onerror = () => reject();
      fr.readAsArrayBuffer(file);
    }).then(async res => {
      const data = new Uint8Array(res as ArrayBuffer);
      const blobs = await this.getBlobsOfPDF(data);
      const base64 = await Promise.all(blobs.map(blob => getImageBase64FromBlob(blob)));
      return blobs.map((blob, i) => new ScanPage(i + 1, blob, base64[i]));
    });
  }
}

function getImageBase64FromBlob(blob: Blob): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
