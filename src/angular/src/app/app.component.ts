import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Resume } from './core/models/resume';
import { ResumeService } from './core/services/resume.service';

@Component({
  selector: 'jpr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  resume: Resume;
  loading = true;
  mobileQuery: MediaQueryList;

  private mobileQueryListener: () => void;

  constructor(
    private resumeService: ResumeService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  ngOnInit(): void {
    this.resumeService.getResume('en').subscribe(resume => {
      if (typeof resume === 'string') {
        console.log(resume);
      } else {
        this.resume = resume;
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  navigateHome(): void {
    this.router.navigateByUrl('/');
  }
}
