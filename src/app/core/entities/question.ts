export interface Question {
  course: number;
  year: number;
  moed: string;
  semester: string;
  photo: string;
  number: number;
  total_grade: number;
}

export interface QuestionId extends Question {
  id: string;
}
