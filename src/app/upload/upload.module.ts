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
import {MatSlideToggleModule, MatSnackBarModule} from '@angular/material';
import {NgxSpinnerModule} from 'ngx-spinner';
import {GamificationModule} from '../gamification/gamification.module';
import {FormsModule} from '@angular/forms';
import { BatchUploadComponent } from './batch-upload/batch-upload.component';
import {FileDropModule} from 'ngx-file-drop';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    UploadComponent,
    ScanPageComponent,
    UploadQuestionComponent,
    BatchUploadComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    UsersModule,
    AngularFontAwesomeModule,
    ImageCropperModule,
    MatSnackBarModule,
    NgxSpinnerModule,
    GamificationModule,
    MatSlideToggleModule,
    FormsModule,
    FileDropModule,
    RouterModule
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
