import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SemesterPipe } from './semester.pipe';

@NgModule({
  declarations: [SemesterPipe],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
