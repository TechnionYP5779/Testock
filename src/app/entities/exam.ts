import {Timestamp} from '@firebase/firestore-types';
import {Moed} from './moed';

export interface Exam {
  moed: Moed;
  created: Timestamp;
}

export interface ExamId extends Exam {
  id: string;
  course: number;
}
