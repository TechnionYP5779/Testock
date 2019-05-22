import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendingScanComponent } from './pending-scan/pending-scan.component';
import {CoreModule} from '../core/core.module';
import { PendingSolutionModalComponent } from './pending-solution-modal/pending-solution-modal.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import {AngularFontAwesomeModule} from 'angular-font-awesome';

@NgModule({
  declarations: [PendingScanComponent, PendingSolutionModalComponent],
  imports: [
    CommonModule,
    CoreModule,
    ImageCropperModule,
    AngularFontAwesomeModule
  ],
  exports: [
    PendingScanComponent,
    PendingSolutionModalComponent
  ]
})
export class PendingScansModule { }
