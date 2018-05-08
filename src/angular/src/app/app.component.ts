import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatButton, MatIconRegistry, MatSidenav } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Resume } from './core/models/resume';
import { ResumeService } from './core/services/resume.service';

@Component({
  selector: 'jpr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild(MatSidenav) sidenav: MatSidenav;
  @ViewChild(MatButton) sidenavMenuButton: MatButton;

  resume: Resume;
  loading = true;

  private mobileQuery: MediaQueryList = matchMedia('(max-width: 600px)');

  constructor(
    zone: NgZone,
    sanitizer: DomSanitizer,
    iconRegistry: MatIconRegistry,
    private router: Router,
    private resumeService: ResumeService
  ) {
    this.mobileQuery.addListener(mql =>
      zone.run(() => (this.mobileQuery = mql))
    );
    this.registerMaterialIcons(iconRegistry, sanitizer);
  }

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      if (this.isMobileScreen() && this.sidenav) {
        this.sidenav.close();
        this.sidenavMenuButton._elementRef.nativeElement.blur();
      }
    });

    this.resumeService.getResume('en').subscribe(resume => {
      if (typeof resume === 'string') {
        console.log(resume);
      } else {
        this.resume = resume;
        this.loading = false;
      }
    });
  }

  isMobileScreen(): boolean {
    return this.mobileQuery.matches;
  }

  navigateHome(): void {
    window.location.href = '/';
  }

  openGitHub(): void {
    window.location.href = this.resume.github;
  }

  openLinkedIn(): void {
    window.location.href = this.resume.linkedin;
  }

  private registerMaterialIcons(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ): void {
    iconRegistry.addSvgIcon(
      'github',
      sanitizer.bypassSecurityTrustResourceUrl('assets/github.svg')
    );

    iconRegistry.addSvgIcon(
      'linkedin',
      sanitizer.bypassSecurityTrustResourceUrl('assets/linkedin.svg')
    );
  }
}
