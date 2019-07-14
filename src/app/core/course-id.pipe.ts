import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'courseId'
})
export class CourseIdPipe implements PipeTransform {

  transform(value: number, args?: any): any {
    return value.toString().padStart(6, '0');
  }

}
