import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'semester'
})
export class SemesterPipe implements PipeTransform {
  transform(value: number, args?: any): string {
    switch (value) {
      case 1: return 'Winter';
      case 2: return 'Spring';
      case 3: return 'Summer';
      default: return 'Unknown semester';
    }
  }
}

@Pipe({
  name: 'moed'
})
export class MoedPipe implements PipeTransform {
  transform(value: number, args?: any): string {
    switch (value) {
      case 1: return 'A';
      case 2: return 'B';
      case 3: return 'C';
      default: return 'Unknown moed';
    }
  }
}
