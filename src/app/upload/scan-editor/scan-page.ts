export class ScanPage {
  pageNum: number;
  hidden: boolean;
  blob: Blob;
  imageBase64: string;
  ocrBlankResult: boolean;


  constructor(pageNum: number, image: Blob, imageBase64: string) {
    this.pageNum = pageNum;
    this.blob = image;
    this.imageBase64 = imageBase64;
  }
}
