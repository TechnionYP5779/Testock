import { Pipe, PipeTransform } from '@angular/core';
import {SemesterPipe} from './semester.pipe';
import {Moed} from '../entities/moed';
import {YearPipe} from './year.pipe';

@Pipe({
  name: 'fullSemester'
})
export class FullSemesterPipe implements PipeTransform {

  constructor(private semesterPipe: SemesterPipe, private yearPipe: YearPipe) {}

  transform(value: Moed, args?: any): any {
      return this.semesterPipe.transform(value) + ' ' + this.yearPipe.transform(value);
  }

}
