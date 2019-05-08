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
  notifications$: Observable<NotificationId[]>;

  constructor(private notifications: NotificationsService, private afs: AngularFirestore) { }

  ngOnInit() {
    this.notifications$ = this.user.pipe(
      flatMap(user => this.notifications.getNotificationsForUser(user.uid))
    );
  }

  seen(event: MouseEvent, notification: NotificationId) {
    event.preventDefault();
    this.updateNotificationState(notification.id, true);
  }

  updateNotificationState(notificationId: string, seen: boolean) {
    this.afs.collection('notifications').doc(notificationId).update({
      seen: seen
    });
  }
}
