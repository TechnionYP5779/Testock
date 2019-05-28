import {Pipe, PipeTransform} from '@angular/core';
import {Moed} from '../entities/moed';

@Pipe({
  name: 'semester'
})
export class SemesterPipe implements PipeTransform {
  transform(value: Moed, args?: any): string {
    if (value.semester.num === 1) {
      return `Winter`;
    } else if (value.semester.num === 2) {
      return `Spring`;
    } else if (value.semester.num === 3) {
      return `Summer`;
    } else {
      return '';
    }
  }
}
