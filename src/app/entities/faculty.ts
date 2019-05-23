import {Timestamp} from '@firebase/firestore-types';

export interface Faculty {
  name: string;
  created: Timestamp;
}

export interface FacultyId extends Faculty {
  id: string;
}
