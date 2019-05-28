import {Timestamp} from '@firebase/firestore-types';
import {Moed} from './moed';

export interface Question {
  course: number;
  moed: Moed;
  photo: string;
  number: number;
  total_grade: number;
  created: Timestamp;
  tags: string[];
  sum_difficulty_ratings: number;
  count_difficulty_ratings: number;
}

export interface QuestionId extends Question {
  id: string;
}
