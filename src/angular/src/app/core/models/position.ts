import { Accomplishment } from './accomplishment';
import { Responsibility } from './responsibility';

export class Position {
  title: string;
  duration: string;
  accomplishments: Accomplishment[] = [];
  responsibilities: Responsibility[] = [];
}
