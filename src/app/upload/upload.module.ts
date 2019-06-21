import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UploadComponent} from './upload/upload.component';
import {CoreModule} from '../core/core.module';
import {UsersModule} from '../users/users.module';
import {PdfService} from './pdf.service';
import {UploadService} from './upload.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {ImageCropperModule} from 'ngx-image-cropper';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {NgxSpinnerModule} from 'ngx-spinner';
import {GamificationModule} from '../gamification/gamification.module';
import {FormsModule} from '@angular/forms';
import { BatchUploadComponent } from './batch-upload/batch-upload.component';
import {NgxFileDropModule} from 'ngx-file-drop';
import {RouterModule} from '@angular/router';
import { ScanEditorComponent } from './scan-editor/scan-editor.component';
import { QuestionSolutionComponent } from './scan-editor/question-solution/question-solution.component';
import { ScanPageComponent } from './scan-editor/scan-page/scan-page.component';
import {NgbAlertModule, NgbButtonsModule, NgbCollapseModule, NgbProgressbarModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import { CropPendingComponent } from './crop-pending/crop-pending.component';
import { ScanEditorPreviewComponent } from './scan-editor/scan-editor-preview/scan-editor-preview.component';
import { ScanDetailsPickerComponent } from './scan-details-picker/scan-details-picker.component';
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    UploadComponent,
    ScanPageComponent,
    BatchUploadComponent,
    ScanEditorComponent,
    QuestionSolutionComponent,
    ScanPageComponent,
    CropPendingComponent,
    ScanEditorPreviewComponent,
    ScanDetailsPickerComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    UsersModule,
    FontAwesomeModule,
    ImageCropperModule,
    MatSnackBarModule,
    NgxSpinnerModule,
    GamificationModule,
    MatSlideToggleModule,
    FormsModule,
    RouterModule,
    NgbCollapseModule,
    NgbTooltipModule,
    NgbButtonsModule,
    NgxFileDropModule,
    NgbProgressbarModule,
    NgbAlertModule,
    DragDropModule
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
