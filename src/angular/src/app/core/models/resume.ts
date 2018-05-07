import { About } from './about';
import { Education } from './education';
import { Experience } from './experience';
import { Skills } from './skills';

export class Resume {
  name: string;
  title: string;
  github: string;
  linkedin: string;
  about: About;
  skills: Skills;
  experience: Experience;
  education: Education;
}
