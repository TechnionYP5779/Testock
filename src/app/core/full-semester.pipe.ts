import { Pipe, PipeTransform } from '@angular/core';
import {SemesterPipe} from './semester.pipe';
import {Moed} from '../entities/moed';

@Pipe({
  name: 'fullSemester'
})
export class FullSemesterPipe implements PipeTransform {

  constructor(private semesterPipe: SemesterPipe) {}

  transform(value: Moed, args?: any): any {
    if (value.num === 1) {
      return this.semesterPipe.transform(value) + ` ${value.semester.year}-${value.semester.year + 1}`;
    } else if (value.num === 2) {
      return this.semesterPipe.transform(value) + ` ${value.semester.year + 1}`;
    } else if (value.num === 3) {
      return this.semesterPipe.transform(value) + ` ${value.semester.year + 1}`;
    } else {
      return value.semester.year.toString();
    }
  }

}
