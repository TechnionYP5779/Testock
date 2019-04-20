import {Monster} from './monster';

export interface Planet {
  order: number;
  title: string;
  description: string;
  image: string;
  min_points: number;
  max_points: number;
  monsters: Monster[];
}
