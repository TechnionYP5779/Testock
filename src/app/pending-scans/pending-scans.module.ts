import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendingScanComponent } from './pending-scan/pending-scan.component';
import {CoreModule} from '../core/core.module';
import { PendingSolutionModalComponent } from './pending-solution-modal/pending-solution-modal.component';

@NgModule({
  declarations: [PendingScanComponent, PendingSolutionModalComponent],
  imports: [
    CommonModule,
    CoreModule
  ],
  exports: [
    PendingScanComponent,
    PendingSolutionModalComponent
  ]
})
export class PendingScansModule { }
