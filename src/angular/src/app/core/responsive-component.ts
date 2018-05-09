import { MediaMatcher } from '@angular/cdk/layout';
import { NgZone } from '@angular/core';

import { constants } from './constants';

export class ResponsiveComponent {
  private portrait: MediaQueryList;
  private landscape: MediaQueryList;
  private tablet: MediaQueryList;
  private desktop: MediaQueryList;
  private widescreen: MediaQueryList;

  private mobileQuery: MediaQueryList;

  constructor(private zone: NgZone, private mediaMatcher: MediaMatcher) {
    const breakpoints = constants.responsiveBreakpoints;

    this.portrait = this.addMediaQuery(this.portrait, breakpoints.xs);
    this.landscape = this.addMediaQuery(this.landscape, breakpoints.sm);
    this.tablet = this.addMediaQuery(this.tablet, breakpoints.md);
    this.desktop = this.addMediaQuery(this.desktop, breakpoints.lg);
    this.widescreen = this.addMediaQuery(this.widescreen, breakpoints.xl);
  }

  isPhoneScreen(): boolean {
    return this.isPortraitPhoneScreen() || this.isLandscapePhoneScreen();
  }

  isPortraitPhoneScreen(): boolean {
    return this.portrait.matches;
  }

  isLandscapePhoneScreen(): boolean {
    return this.landscape.matches;
  }

  isLandscapePhoneOrLargerScreen(): boolean {
    return (
      this.landscape.matches ||
      this.isTabletScreen() ||
      this.isDesktopScreen() ||
      this.isWidescreenScreen()
    );
  }

  isTabletScreen(): boolean {
    return this.tablet.matches;
  }

  isTabletOrLargerScreen(): boolean {
    return (
      this.tablet.matches || this.isDesktopScreen() || this.isWidescreenScreen()
    );
  }

  isDesktopScreen(): boolean {
    return this.desktop.matches;
  }

  isDesktopOrLargerScreen(): boolean {
    return this.desktop.matches || this.isWidescreenScreen();
  }

  isWidescreenScreen(): boolean {
    return this.widescreen.matches;
  }

  private addMediaQuery(
    mediaQuery: MediaQueryList,
    breakpoint: { up?: number; down?: number }
  ): MediaQueryList {
    if (breakpoint.up && breakpoint.down) {
      mediaQuery = this.mediaMatcher.matchMedia(
        `(min-width: ${breakpoint.up}px) and (max-width: ${breakpoint.down}px)`
      );
    } else if (breakpoint.up) {
      mediaQuery = this.mediaMatcher.matchMedia(
        `(min-width: ${breakpoint.up}px)`
      );
    } else if (breakpoint.down) {
      mediaQuery = this.mediaMatcher.matchMedia(
        `(max-width: ${breakpoint.down}px)`
      );
    }

    mediaQuery.addListener(mql => this.zone.run(() => (mediaQuery = mql)));

    return mediaQuery;
  }
}
