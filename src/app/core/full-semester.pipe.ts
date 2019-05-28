import { Pipe, PipeTransform } from '@angular/core';
import {SemesterPipe} from './semester.pipe';
import {Semester} from '../entities/semester';

@Pipe({
  name: 'fullSemester'
})
export class FullSemesterPipe implements PipeTransform {

  constructor(private semesterPipe: SemesterPipe) {}

  transform(value: Semester, args?: any): any {
    if (value.num === 1) {
      return this.semesterPipe.transform(value) + ` ${value.year}-${value.year + 1}`;
    } else if (value.num === 2) {
      return this.semesterPipe.transform(value) + ` ${value.year + 1}`;
    } else if (value.num === 3) {
      return this.semesterPipe.transform(value) + ` ${value.year + 1}`;
    } else {
      return value.year.toString();
    }
  }

}
