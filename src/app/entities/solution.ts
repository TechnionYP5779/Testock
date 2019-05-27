import {Timestamp} from '@firebase/firestore-types';

export interface Solution {
  grade: number;
  photos?: string[];
  pendingScanId?: string;
  created: Timestamp;
}

export interface SolutionId extends Solution {
  id: string;
}
