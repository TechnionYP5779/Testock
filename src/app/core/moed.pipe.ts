import { Pipe, PipeTransform } from '@angular/core';
import {Moed} from '../entities/moed';

@Pipe({
  name: 'moed'
})
export class MoedPipe implements PipeTransform {

  transform(value: Moed, args?: any): any {
    if (value.num === 1) {
      return 'A';
    } else if (value.num === 2) {
      return 'B';
    } else if (value.num === 3) {
      return 'C';
    } else {
      return value.num;
    }
  }
}
