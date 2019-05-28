import {Pipe, PipeTransform} from '@angular/core';
import {Semester} from '../entities/semester';

@Pipe({
  name: 'semester'
})
export class SemesterPipe implements PipeTransform {
  transform(value: Semester, args?: any): string {
    if (value.num === 1) {
      return `Winter`;
    } else if (value.num === 2) {
      return `Spring`;
    } else if (value.num === 3) {
      return `Summer`;
    } else {
      return '';
    }
  }
}
