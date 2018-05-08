import { Component, Input, NgZone } from '@angular/core';

import { constants } from '../../core/constants';
import { Position } from '../../core/models/position';

@Component({
  selector: 'jpr-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionComponent {
  @Input() position: Position;

  private mobileQuery: MediaQueryList = matchMedia(
    `(max-width: ${constants.mobileWidth}px)`
  );

  constructor(zone: NgZone) {
    this.mobileQuery.addListener(mql =>
      zone.run(() => (this.mobileQuery = mql))
    );
  }

  isMobileScreen(): boolean {
    return this.mobileQuery.matches;
  }
}
