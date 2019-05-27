import {Timestamp} from '@firebase/firestore-types';

export interface Question {
  course: number;
  year: number;
  moed: string;
  semester: string;
  photo: string;
  number: number;
  total_grade: number;
  created: Timestamp;
  tags: string[];
}

export interface QuestionId extends Question {
  id: string;
}
