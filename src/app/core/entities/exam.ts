export interface Exam {
  moed: string;
  semester: string;
  year: number;
}

export interface ExamId extends Exam {
  id: string;
  course: number;
}
