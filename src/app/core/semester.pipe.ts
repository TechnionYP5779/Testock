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
