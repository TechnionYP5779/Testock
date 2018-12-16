export class Exam {
  public moed: string;
  public semester: string;
  public year: number;
}

export class ExamId extends Exam {
  public id: string;
  public course: number;
}
