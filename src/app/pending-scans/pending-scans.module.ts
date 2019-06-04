import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendingScanComponent } from './pending-scan/pending-scan.component';
import {CoreModule} from '../core/core.module';
import { PendingSolutionModalComponent } from './pending-solution-modal/pending-solution-modal.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {UploadModule} from '../upload/upload.module';
import {FormsModule} from '@angular/forms';
import {NgxSpinnerModule} from 'ngx-spinner';
import {MatSnackBarModule} from '@angular/material';
import { PendingScansListComponent } from './pending-scans-list/pending-scans-list.component';
import {AppRoutingModule} from '../app-routing.module';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import { PendingScanModalComponent } from './pending-scan-modal/pending-scan-modal.component';

@NgModule({
  declarations: [PendingScanComponent, PendingSolutionModalComponent, PendingScansListComponent, PendingScanModalComponent],
  imports: [
    CommonModule,
    CoreModule,
    ImageCropperModule,
    AngularFontAwesomeModule,
    UploadModule,
    FormsModule,
    NgxSpinnerModule,
    MatSnackBarModule,
    AppRoutingModule,
    NgbModalModule
  ],
  exports: [
    PendingScansListComponent,
    PendingSolutionModalComponent,
    PendingScanModalComponent
  ]
})
export class PendingScansModule { }
