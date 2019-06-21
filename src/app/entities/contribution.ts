import {Timestamp} from '@firebase/firestore-types';
import {Moed} from './moed';

export enum ContributionType {
  SOLUTION,
  TOPIC,
  COMMENT,
  PENDING_SCAN
}

export interface Contribution {
  type: ContributionType;
  created: Timestamp;
  solutionId?: string;
  questionId?: string;
  course?: number;
  moed?: Moed;
  qNumber?: number;
}
