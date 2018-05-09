import { MediaMatcher } from '@angular/cdk/layout';
import { Component, NgZone, OnInit } from '@angular/core';

import { About } from '../core/models/about';
import { ResponsiveComponent } from '../core/responsive-component';
import { ResumeService } from '../core/services/resume.service';

@Component({
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent extends ResponsiveComponent implements OnInit {
  about: About;

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
        this.about = resume.about;
      }
    });
  }
}
