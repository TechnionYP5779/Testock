export interface Comment {
  subject: string;
  text: string;
}

export interface CommentId extends Comment {
  id: string;
}
