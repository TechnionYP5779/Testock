import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';
import {NotificationsService} from './notifications.service';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AppRoutingModule} from '../app-routing.module';

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
    AngularFontAwesomeModule,
    AngularFirestoreModule,
    AppRoutingModule
  ]
})
export class NotificationsModule { }
