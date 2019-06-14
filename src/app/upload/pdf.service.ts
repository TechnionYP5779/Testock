import {Injectable} from '@angular/core';
import {ScanPage} from './scan-editor/scan-page';

declare let pdfjsLib: any;
const PDFJS = pdfjsLib;

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  readonly PAGES_EXPORT_WIDTH = 1700;

  constructor() { }

  private async getPDFPages(file: string|Uint8Array): Promise<ScanPage[]> {
    const doc = await PDFJS.getDocument(file);
    const canvas = document.createElement('canvas');
    const pages = [];

    for (let i = 1; i <= doc.numPages; ++i) {
      const page = await doc.getPage(i);
      let viewport = page.getViewport(1);
      viewport = page.getViewport(this.PAGES_EXPORT_WIDTH / viewport.width);
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({canvasContext: context, viewport: viewport});

      const base64 = canvas.toDataURL('image/jpeg');
      const blob = await new Promise<Blob>(resolve => {
        canvas.toBlob(newBlob => resolve(newBlob), 'image/jpeg');
      });

      pages.push(new ScanPage(i, blob, base64));
    }

    return pages;
  }

  public getScanPagesOfPDF(file: File): Promise<ScanPage[]> {

    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.onerror = () => reject(fr.error);
      fr.readAsArrayBuffer(file);
    }).then(async res => {
      const data = new Uint8Array(res as ArrayBuffer);
      return this.getPDFPages(data);
    });
  }
}
