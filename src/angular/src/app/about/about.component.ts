import { Component, OnInit } from '@angular/core';

import { About } from '../core/models/about';
import { ResumeService } from '../core/services/resume.service';

@Component({
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  about: About;

  constructor(private resumeService: ResumeService) {}

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
