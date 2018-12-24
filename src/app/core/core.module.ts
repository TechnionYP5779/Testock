import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SemesterPipe } from './semester.pipe';
import { SafeUrlPipe } from './safe-url.pipe';

@NgModule({
  declarations: [SemesterPipe, SafeUrlPipe],
  imports: [
    CommonModule
  ],
  exports: [SemesterPipe, SafeUrlPipe]
})
export class CoreModule { }
