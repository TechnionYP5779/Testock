import {Faculty} from './faculty';
import {Timestamp} from '@firebase/firestore-types';

export interface Course {
  id: string;
  name: string;
  faculty: string;
  description: string;
  created: Timestamp;
  tags: string[];
}

export interface CourseWithFaculty {
  id: number;
  name: string;
  faculty: Faculty;
  description: string;
  tags: string[];
}
