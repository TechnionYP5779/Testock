import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SemesterPipe} from './semester.pipe';
import {SafeUrlPipe} from './safe-url.pipe';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {DbService} from './db.service';
import {OCRService} from './ocr.service';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireStorageModule} from '@angular/fire/storage';
import { MoedPipe } from './moed.pipe';
import { FullMoedPipe } from './full-moed.pipe';
import { FullSemesterPipe } from './full-semester.pipe';
import { YearPipe } from './year.pipe';
import { CourseIdPipe } from './course-id.pipe';

@NgModule({
  declarations: [
    SemesterPipe,
    SafeUrlPipe,
    MoedPipe,
    FullMoedPipe,
    FullSemesterPipe,
    YearPipe,
    CourseIdPipe
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    AngularFirestoreModule,
    AngularFireStorageModule
  ],
  providers: [
    HttpClient,
    DbService,
    OCRService,
    YearPipe,
    MoedPipe,
    SemesterPipe,
    FullSemesterPipe
  ],
  exports: [
    SemesterPipe,
    SafeUrlPipe,
    FullMoedPipe,
    FullSemesterPipe,
    SemesterPipe,
    MoedPipe,
    YearPipe,
    CourseIdPipe
  ]
})
export class CoreModule { }
