import {Timestamp} from '@firebase/firestore-types';

export interface Exam {
  moed: string;
  semester: string;
  year: number;
  created: Timestamp;
}

export interface ExamId extends Exam {
  id: string;
  course: number;
}
