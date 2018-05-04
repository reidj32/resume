import { Component, OnInit } from '@angular/core';
import { ResumeService } from './core/services/resume.service';
import { Resume } from './core/models/resume';
import { About } from './core/models/about';

@Component({
  selector: 'jpr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  resume: Resume;

  constructor(private resumeService: ResumeService) {}

  ngOnInit(): void {
    this.resumeService.getResume('en').subscribe(resume => {
      if (typeof resume === 'string') {
        console.log(resume);
      } else {
        this.resume = resume;
      }
    });
  }
}
