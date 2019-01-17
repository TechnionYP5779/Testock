export interface Topic {
  subject: string;
  text: string;
  correctAnswerId?: string;
  creator: string;
  linkedQuestionId?: string;
  linkedCourseId?: number;
}

export interface TopicId extends Topic {
  id: string;
}
