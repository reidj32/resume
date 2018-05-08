import { MediaMatcher } from '@angular/cdk/layout';
import { Component, NgZone, OnInit } from '@angular/core';

import { Experience } from '../core/models/experience';
import { ResponsiveComponent } from '../core/responsive-component';
import { ResumeService } from '../core/services/resume.service';

@Component({
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent extends ResponsiveComponent implements OnInit {
  experience: Experience;

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
        this.experience = resume.experience;
      }
    });
  }
}
