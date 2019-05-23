import {Faculty} from './faculty';
import {Timestamp} from '@firebase/firestore-types';

export interface Course {
  id: number;
  name: string;
  faculty: string;
  created: Timestamp;
}

export interface CourseWithFaculty {
  id: number;
  name: string;
  faculty: Faculty;
}
