import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendingScanComponent } from './pending-scan/pending-scan.component';

@NgModule({
  declarations: [PendingScanComponent],
  imports: [
    CommonModule
  ],
  exports: [
    PendingScanComponent
  ]
})
export class PendingScansModule { }
