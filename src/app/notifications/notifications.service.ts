import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Notification} from '../entities/notification';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private afs: AngularFirestore) { }

  getNotificationsForUser(uid: string): Observable<Notification[]> {
    const queries = r =>
      r.where('recipientId', '==', uid)
        .orderBy('datetime', 'desc');

    return this.afs.collection<Notification>('notifications', queries).valueChanges();
  }
}
