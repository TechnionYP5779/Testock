export interface Topic {
  subject: string;
  text: string;
  correctAnswerId?: string;
  creator: string;
  tagging?: Tag;
}

export interface Tag {
  course: number;
}

export interface QuestionTag extends Tag {
  year: number;
  semester: string;
  moed: string;
  qNumber: number;
}
