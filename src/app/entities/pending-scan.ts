import {Timestamp} from '@firebase/firestore-types';
import {Moed} from './moed';

export interface LinkedQuestion {
  qid: string;
  num: number;
  sid: string;
}

export interface PendingScan {
  course: number;
  moed: Moed;
  pages: string[];
  created: Timestamp;
  linkedQuestions: LinkedQuestion[];
}

export interface PendingScanId extends PendingScan {
  id: string;
}
