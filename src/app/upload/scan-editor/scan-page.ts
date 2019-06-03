export class ScanPage {
  pageNum: number;
  hidden: boolean;
  blob: Blob;
  imageBase64: string;
  ocrBlankResult: boolean;
  highlight = 0;

  constructor(pageNum: number, image: Blob, imageBase64: string) {
    this.pageNum = pageNum;
    this.blob = image;
    this.imageBase64 = imageBase64;
  }

  highlightInc() {
    this.highlight++;
  }

  highlightDec() {
    this.highlight--;
  }
}
