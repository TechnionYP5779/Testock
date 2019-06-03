import {ScanPage} from './scan-page';

export class SolutionImage {
  base64: string;
  source: ScanPage;

  constructor(bsae64: string, source: ScanPage) {
    this.base64 = bsae64;
    this.source = source;
  }
}
