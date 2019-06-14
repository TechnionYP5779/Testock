import {Moed} from './moed';

export class ScanDetails {
  course: number;
  moed: Moed;

  constructor(course: number, moed: Moed) {
    this.course = course;
    this.moed = moed;
  }
}
