import { Contact } from './contact';
import { Position } from './position';

export class History {
  company: string;
  description: string;
  contact: Contact;
  positions: Position[] = [];
}
