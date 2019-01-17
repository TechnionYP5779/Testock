export interface Comment {
  subject: string;
  text: string;
  creator: string;
  created: Date;
}

export interface CommentId extends Comment {
  id: string;
}
