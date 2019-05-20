import {Timestamp} from '@firebase/firestore-types';

export interface Notification {
  recipientId: string;
  content: string;
  url: string;
  seen: boolean;
  datetime: Timestamp;
}

export interface NotificationId extends Notification {
  id: string;
}
