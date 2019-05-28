import { Pipe, PipeTransform } from '@angular/core';
import {Moed} from '../entities/moed';

@Pipe({
  name: 'year'
})
export class YearPipe implements PipeTransform {

  transform(value: Moed, args?: any): any {
    if (value.semester.num === 1) {
      return `${value.semester.year}-${value.semester.year + 1}`;
    } else if (value.semester.num === 2) {
      return `${value.semester.year + 1}`;
    } else if (value.semester.num === 3) {
      return `${value.semester.year + 1}`;
    } else {
      return value.semester.year.toString();
    }
  }

}
