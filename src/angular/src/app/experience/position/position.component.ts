import { MediaMatcher } from '@angular/cdk/layout';
import { Component, Input, NgZone } from '@angular/core';

import { Position } from '../../core/models/position';
import { ResponsiveComponent } from '../../core/responsive-component';

@Component({
  selector: 'jpr-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionComponent extends ResponsiveComponent {
  @Input() position: Position;

  constructor(zone: NgZone, mediaMatcher: MediaMatcher) {
    super(zone, mediaMatcher);
  }
}
