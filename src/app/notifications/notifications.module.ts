import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';
import {NotificationsService} from './notifications.service';
import {AngularFontAwesomeModule} from 'angular-font-awesome';

@NgModule({
  declarations: [
    NotificationsListComponent
  ],
  providers: [
    NotificationsService
  ],
  exports: [
    NotificationsListComponent
  ],
  imports: [
    CommonModule,
    AngularFontAwesomeModule
  ]
})
export class NotificationsModule { }
