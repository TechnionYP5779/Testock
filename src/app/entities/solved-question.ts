export interface SolvedQuestion {
  linkedQuestionId: string;
  difficulty: number;
}

export interface SolvedQuestionId extends SolvedQuestion {
  id: string;
}
