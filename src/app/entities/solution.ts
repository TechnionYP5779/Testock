export interface Solution {
  grade: number;
  photos?: string[];
  pendingScanId?: string;
}

export interface SolutionId extends Solution {
  id: string;
}
