import { MediaMatcher } from '@angular/cdk/layout';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatButton, MatIconRegistry, MatSidenav } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { Resume } from './core/models/resume';
import { ResponsiveComponent } from './core/responsive-component';
import { ResumeService } from './core/services/resume.service';

@Component({
  selector: 'jpr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends ResponsiveComponent implements OnInit {
  @ViewChild(MatSidenav) sidenav: MatSidenav;
  @ViewChild(MatButton) sidenavMenuButton: MatButton;

  resume: Resume;
  loading = true;
  aboutColor: string;
  skillsColor: string;
  experienceColor: string;
  educationColor: string;

  constructor(
    zone: NgZone,
    mediaMatcher: MediaMatcher,
    sanitizer: DomSanitizer,
    iconRegistry: MatIconRegistry,
    router: Router,
    private resumeService: ResumeService
  ) {
    super(zone, mediaMatcher);
    this.registerMaterialIcons(iconRegistry, sanitizer);

    router.events
      .pipe(filter(e => e instanceof RouterEvent))
      .subscribe((event: RouterEvent) => {
        this.aboutColor = event.url.indexOf('/about') >= 0 ? 'primary' : '';
        this.skillsColor = event.url.indexOf('/skills') >= 0 ? 'primary' : '';
        this.experienceColor =
          event.url.indexOf('/experience') >= 0 ? 'primary' : '';
        this.educationColor =
          event.url.indexOf('/education') >= 0 ? 'primary' : '';
      });
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

  closeSidenavForSmallScreens(): void {
    if (this.isPhoneScreen()) {
      this.sidenav.close();
      this.sidenavMenuButton._elementRef.nativeElement.blur();
    }
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
      sanitizer.bypassSecurityTrustResourceUrl(
        `${environment.iconPath}github.svg`
      )
    );

    iconRegistry.addSvgIcon(
      'linkedin',
      sanitizer.bypassSecurityTrustResourceUrl(
        `${environment.iconPath}linkedin.svg`
      )
    );
  }
}
