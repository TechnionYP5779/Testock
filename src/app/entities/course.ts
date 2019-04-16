import {Faculty} from './faculty';

export interface Course {
  id: number;
  name: string;
  faculty: string;
}

export interface CourseWithFaculty {
  id: number;
  name: string;
  faculty: Faculty;
}
