import {ScanPage} from './scan-page';

export class SolutionImage {
  bsae64: string;
  source: ScanPage;

  constructor(bsae64: string, source: ScanPage) {
    this.bsae64 = bsae64;
    this.source = source;
  }
}
