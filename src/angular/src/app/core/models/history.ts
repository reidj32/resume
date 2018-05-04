import { Contact } from './contact';
import { Position } from './position';

export class History {
  id: string;
  company: string;
  contact: Contact;
  positions: Position[] = [];
}
