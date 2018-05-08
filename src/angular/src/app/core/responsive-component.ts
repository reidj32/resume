import { MediaMatcher } from '@angular/cdk/layout';
import { NgZone } from '@angular/core';

import { constants } from './constants';

export class ResponsiveComponent {
  private mobileQuery: MediaQueryList;

  constructor(zone: NgZone, mediaMatcher: MediaMatcher) {
    this.mobileQuery = mediaMatcher.matchMedia(
      `(max-width: ${constants.mobileWidth}px)`
    );

    this.mobileQuery.addListener(mql =>
      zone.run(() => (this.mobileQuery = mql))
    );
  }

  isMobileScreen(): boolean {
    return this.mobileQuery.matches;
  }
}
