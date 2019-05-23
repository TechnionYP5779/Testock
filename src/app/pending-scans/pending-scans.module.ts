import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendingScanComponent } from './pending-scan/pending-scan.component';
import {CoreModule} from '../core/core.module';
import { PendingScansListComponent } from './pending-scans-list/pending-scans-list.component';
import {AppRoutingModule} from '../app-routing.module';

@NgModule({
  declarations: [PendingScanComponent, PendingScansListComponent],
  imports: [
    CommonModule,
    CoreModule,
    AppRoutingModule
  ],
  exports: [
    PendingScansListComponent
  ]
})
export class PendingScansModule { }
