import { Component, NgZone, OnInit } from '@angular/core';

import { constants } from '../core/constants';
import { Experience } from '../core/models/experience';
import { ResumeService } from '../core/services/resume.service';

@Component({
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit {
  experience: Experience;

  private mobileQuery: MediaQueryList = matchMedia(
    `(max-width: ${constants.mobileWidth}px)`
  );

  constructor(zone: NgZone, private resumeService: ResumeService) {
    this.mobileQuery.addListener(mql =>
      zone.run(() => (this.mobileQuery = mql))
    );
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

  isMobileScreen(): boolean {
    return this.mobileQuery.matches;
  }
}
