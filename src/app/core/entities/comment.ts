import {UserData} from './user';
import {Timestamp} from '@firebase/firestore-types';

export interface Comment {
  subject: string;
  text: string;
  creator: string;
  created: Timestamp;
}

export interface CommentWithCreator {
  subject: string;
  text: string;
  creator: UserData;
  created: Timestamp;
}

export interface CommentId extends Comment {
  id: string;
}

export interface CommentWithCreatorId extends CommentWithCreator{
  id: string;
}
