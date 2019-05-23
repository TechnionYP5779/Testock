import {Timestamp} from '@firebase/firestore-types';

export interface PendingScan {
  course: number;
  year: number;
  moed: string;
  semester: string;
  pages: string[];
  created: Timestamp;
}

export interface PendingScanId extends PendingScan {
  id: string;
}
