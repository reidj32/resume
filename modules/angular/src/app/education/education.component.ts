import { MediaMatcher } from '@angular/cdk/layout';
import { Component, NgZone, OnInit } from '@angular/core';

import { Education } from '../core/models/education';
import { ResponsiveComponent } from '../core/responsive-component';
import { ResumeService } from '../core/services/resume.service';

@Component({
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent extends ResponsiveComponent implements OnInit {
  education: Education;

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
        this.education = resume.education;
      }
    });
  }
}
