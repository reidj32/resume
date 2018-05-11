import { MediaMatcher } from '@angular/cdk/layout';
import { Component, Input, NgZone } from '@angular/core';

import { Contact } from '../../core/models/contact';
import { ResponsiveComponent } from '../../core/responsive-component';

@Component({
  selector: 'jpr-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent extends ResponsiveComponent {
  @Input() contact: Contact;

  constructor(zone: NgZone, mediaMatcher: MediaMatcher) {
    super(zone, mediaMatcher);
  }
}
