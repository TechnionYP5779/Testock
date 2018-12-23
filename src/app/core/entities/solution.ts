export interface Solution {
  photo: string;
  grade: number;
  photos: string[];
}

export interface SolutionId extends Solution {
  id: string;
}
