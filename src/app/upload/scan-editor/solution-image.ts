import {ScanPage} from './scan-page';

export class SolutionImage {
  base64: string;
  source: ScanPage;
  size: number;

  constructor(base64: string, size: number, source: ScanPage) {
    this.base64 = base64;
    this.size = size;
    this.source = source;
  }
}
