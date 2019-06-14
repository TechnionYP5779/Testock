import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';
import {NotificationsService} from './notifications.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AppRoutingModule} from '../app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

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
    FontAwesomeModule,
    AngularFirestoreModule,
    AppRoutingModule,
    NgbModule
  ]
})
export class NotificationsModule { }
