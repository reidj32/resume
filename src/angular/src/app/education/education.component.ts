import { Component, OnInit } from '@angular/core';

import { Education } from '../core/models/education';
import { ResumeService } from '../core/services/resume.service';

@Component({
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent implements OnInit {
  education: Education;

  constructor(private resumeService: ResumeService) {}

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
