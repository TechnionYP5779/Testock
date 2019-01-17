export interface Comment {
  subject: string;
  text: string;
  creator: string;
}

export interface CommentId extends Comment {
  id: string;
}
