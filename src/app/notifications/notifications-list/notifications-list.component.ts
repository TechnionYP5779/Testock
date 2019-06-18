import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NotificationId} from '../../entities/notification';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {NotificationsService} from '../notifications.service';
import {switchMap} from 'rxjs/operators';
import {UserData} from '../../entities/user';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit {
  @Input() user: Observable<UserData>;
  public notifications$: Observable<NotificationId[]>;
  @Output() notificationClicked = new EventEmitter<NotificationId>();

  constructor(private notifications: NotificationsService) { }

  ngOnInit() {
    this.notifications$ = this.user.pipe(
      switchMap(user => this.notifications.getNotificationsForUser(user.uid, 30))
    );
  }

  changeSeen(event: MouseEvent, notification: NotificationId, seen: boolean, redirect: boolean = true) {
    if (redirect === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.notifications.updateNotificationState(notification.id, seen);

    if (redirect === true) {
      this.notificationClicked.emit(notification);
    }
  }

  toggleSeen(event: MouseEvent, notification: NotificationId, redirect: boolean) {
    this.changeSeen(event, notification, !notification.seen, redirect);
  }
}
