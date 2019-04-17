import {UserData} from './user';
import {Timestamp} from '@firebase/firestore-types';

export interface Topic {
  subject: string;
  text: string;
  correctAnswerId?: string;
  creator: string;
  linkedQuestionId?: string;
  linkedCourseId?: number;
  created: Timestamp;
}

export interface TopicWithCreator {
  subject: string;
  text: string;
  correctAnswerId?: string;
  creator: UserData;
  linkedQuestionId?: string;
  linkedCourseId?: number;
  created: Timestamp;
}

export interface TopicId extends Topic {
  id: string;
}

export interface TopicWithCreatorId extends TopicWithCreator {
  id: string;
}
