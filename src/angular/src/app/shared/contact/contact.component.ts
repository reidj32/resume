import { Component, Input, OnInit } from '@angular/core';

import { Contact } from '../../core/models/contact';

@Component({
  selector: 'jpr-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  @Input() contact: Contact;
}
