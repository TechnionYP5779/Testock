export class Question {
  public course: number;
  public year: number;
  public moed: string;
  public semester: string;
  public photo: string;
  public number: number;
  public total_grade: number;
}

export class QuestionId extends Question {
  public id: string;
}
