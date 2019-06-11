import {ScanPage} from './scan-page';

export class SolutionImage {
  base64: string;
  source: ScanPage;
  size: number;
  fullPage: boolean;

  constructor(base64: string, size: number, source: ScanPage, fullPage = false) {
    this.base64 = base64;
    this.size = size;
    this.source = source;
    this.fullPage = fullPage;
  }
}
