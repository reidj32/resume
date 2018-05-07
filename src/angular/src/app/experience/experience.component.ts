import { Component, OnInit } from '@angular/core';

import { Experience } from '../core/models/experience';
import { ResumeService } from '../core/services/resume.service';

@Component({
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit {
  experience: Experience;

  constructor(private resumeService: ResumeService) {}

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
