import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SemesterPipe } from './semester.pipe';
import { SafeUrlPipe } from './safe-url.pipe';
import {HttpClient, HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [SemesterPipe, SafeUrlPipe],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [HttpClient],
  exports: [SemesterPipe, SafeUrlPipe]
})
export class CoreModule { }
