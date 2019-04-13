import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminComponent} from './admin/admin.component';
import {FacultyControlPanelComponent} from './faculty-control-panel/faculty-control-panel.component';
import {CoreModule} from '../core/core.module';
import {UsersModule} from '../users/users.module';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AdminComponent,
    FacultyControlPanelComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    CoreModule,
    UsersModule
  ],
  exports: [
    AdminComponent
  ]
})
export class AdminModule { }
