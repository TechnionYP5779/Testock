import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UploadComponent} from './upload/upload.component';
import {ScanPageComponent} from './upload/scan-page/scan-page.component';
import {UploadQuestionComponent} from './upload/upload-question/upload-question.component';
import {CoreModule} from '../core/core.module';
import {UsersModule} from '../users/users.module';
import {PdfService} from './pdf.service';
import {UploadService} from './upload.service';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {ImageCropperModule} from 'ngx-image-cropper';
import {MatSnackBarModule} from '@angular/material';
import {NgxSpinnerModule} from 'ngx-spinner';

@NgModule({
  declarations: [
    UploadComponent,
    ScanPageComponent,
    UploadQuestionComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    UsersModule,
    AngularFontAwesomeModule,
    ImageCropperModule,
    MatSnackBarModule,
    NgxSpinnerModule
  ],
  providers: [
    UploadService,
    PdfService
  ],
  exports: [
    UploadComponent
  ]
})
export class UploadModule { }