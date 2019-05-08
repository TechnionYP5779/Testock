import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Notification, NotificationId} from '../entities/notification';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {Question} from '../entities/question';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private afs: AngularFirestore) { }

  getNotificationsForUser(uid: string): Observable<NotificationId[]> {
    const queries = r =>
      r.where('recipientId', '==', uid)
        .orderBy('datetime', 'desc');

    return this.afs.collection<Notification>('notifications', queries).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Notification;
        const nid = a.payload.doc.id;
        return {id: nid, ...data};
      }))
    );
  }
}
