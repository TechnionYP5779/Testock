import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendingScanComponent } from './pending-scan/pending-scan.component';
import {CoreModule} from '../core/core.module';

@NgModule({
  declarations: [PendingScanComponent],
  imports: [
    CommonModule,
    CoreModule
  ],
  exports: [
    PendingScanComponent
  ]
})
export class PendingScansModule { }
