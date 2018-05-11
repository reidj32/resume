import { MediaMatcher } from '@angular/cdk/layout';
import { Component, Input, NgZone } from '@angular/core';

import { Address } from '../../core/models/address';
import { ResponsiveComponent } from '../../core/responsive-component';

@Component({
  selector: 'jpr-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent extends ResponsiveComponent {
  @Input() address: Address;

  constructor(zone: NgZone, mediaMatcher: MediaMatcher) {
    super(zone, mediaMatcher);
  }
}
