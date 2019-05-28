import { Pipe, PipeTransform } from '@angular/core';
import {Moed} from '../entities/moed';
import {MoedPipe} from './moed.pipe';
import {FullSemesterPipe} from './full-semester.pipe';

@Pipe({
  name: 'fullMoed'
})
export class FullMoedPipe implements PipeTransform {

  constructor (private fullSemesterPipe: FullSemesterPipe, private moedPipe: MoedPipe) {}

  transform(value: Moed, args?: any): any {
    return this.fullSemesterPipe.transform(value.semester) + ' - Moed ' + this.moedPipe.transform(value);
  }

}
