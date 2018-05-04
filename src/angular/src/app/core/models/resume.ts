import { About } from './about';
import { Education } from './education';
import { Experience } from './experience';
import { Skills } from './skills';

export class Resume {
  name: string;
  title: string;
  about: About;
  skills: Skills;
  experience: Experience;
  education: Education;
}
