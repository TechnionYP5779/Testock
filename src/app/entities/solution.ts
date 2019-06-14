import {Timestamp} from '@firebase/firestore-types';

export interface Solution {
  grade: number;
  photos?: string[];
  linkedToPendingScanId: string;
  created: Timestamp;
  uploadInProgress: boolean;
  extractedFromPendingScanId: string;
}

export interface SolutionId extends Solution {
  id: string;
}
