import { MediaMatcher } from '@angular/cdk/layout';
import { Component, NgZone, OnInit } from '@angular/core';

import { Skills } from '../core/models/skills';
import { ResponsiveComponent } from '../core/responsive-component';
import { ResumeService } from '../core/services/resume.service';

@Component({
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent extends ResponsiveComponent implements OnInit {
  skills: Skills;

  constructor(
    zone: NgZone,
    mediaMatcher: MediaMatcher,
    private resumeService: ResumeService
  ) {
    super(zone, mediaMatcher);
  }

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
