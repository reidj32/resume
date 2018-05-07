import { Component, OnInit } from '@angular/core';

import { Skills } from '../core/models/skills';
import { ResumeService } from '../core/services/resume.service';

@Component({
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
  skills: Skills;

  constructor(private resumeService: ResumeService) {}

  ngOnInit(): void {
    this.resumeService.getResume('en').subscribe(resume => {
      if (typeof resume === 'string') {
        console.log(resume);
      } else {
        this.skills = resume.skills;
      }
    });
  }
}
