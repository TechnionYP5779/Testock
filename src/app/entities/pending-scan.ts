import {Timestamp} from '@firebase/firestore-types';
import {Moed} from './moed';

export interface PendingScan {
  course: number;
  moed: Moed;
  pages: string[];
  created: Timestamp;
}

export interface PendingScanId extends PendingScan {
  id: string;
}
