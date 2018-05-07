import { Component, OnInit, Input } from '@angular/core';
import { Address } from '../../core/models/address';

@Component({
  selector: 'jpr-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent {
  @Input() address: Address;
}
