export interface Topic {
  subject: string;
  text: string;
  correctAnswerId?: string;
  creator: string;
  linkedQuestionId?: string;
}
