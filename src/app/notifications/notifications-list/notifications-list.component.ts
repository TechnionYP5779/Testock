import {Component, Input, OnInit} from '@angular/core';
import {NotificationId} from '../../entities/notification';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {NotificationsService} from '../notifications.service';
import {flatMap} from 'rxjs/operators';
import {UserData} from '../../entities/user';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit {
  @Input() user: Observable<UserData>;
  public notifications$: Observable<NotificationId[]>;

  constructor(private notifications: NotificationsService) { }

  ngOnInit() {
    this.notifications$ = this.user.pipe(
      flatMap(user => this.notifications.getNotificationsForUser(user.uid, 30))
    );
  }

  toggleSeen(event: MouseEvent, notification: NotificationId, redirect: boolean) {
    if (redirect === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.notifications.updateNotificationState(notification.id, !notification.seen);
  }
}
