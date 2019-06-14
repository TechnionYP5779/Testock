import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminComponent} from './admin/admin.component';
import {FacultyControlPanelComponent} from './faculty-control-panel/faculty-control-panel.component';
import {CoreModule} from '../core/core.module';
import {UsersModule} from '../users/users.module';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NgxSpinnerModule} from 'ngx-spinner';
import { UsersTableComponent } from './users-table/users-table.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [
    AdminComponent,
    FacultyControlPanelComponent,
    UsersTableComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    CoreModule,
    UsersModule,
    RouterModule,
    NgxSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatIconModule
  ],
  exports: [
    AdminComponent
  ]
})
export class AdminModule { }
