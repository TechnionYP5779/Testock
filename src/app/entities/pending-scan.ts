export interface PendingScan {
  course: number;
  year: number;
  moed: string;
  semester: string;
  pages: string[];
}

export interface PendingScanId extends PendingScan {
  id: string;
}
