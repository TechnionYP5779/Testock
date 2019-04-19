import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SemesterPipe} from './semester.pipe';
import {SafeUrlPipe} from './safe-url.pipe';
import {HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http';
import {DbService} from './db.service';
import {OCRService} from './ocr.service';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireStorageModule} from '@angular/fire/storage';

@NgModule({
  declarations: [
    SemesterPipe,
    SafeUrlPipe
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
    OCRService
  ],
  exports: [
    SemesterPipe,
    SafeUrlPipe
  ]
})
export class CoreModule { }
