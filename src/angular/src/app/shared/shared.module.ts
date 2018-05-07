import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AddressComponent } from './address/address.component';
import { ContactComponent } from './contact/contact.component';
import { MaterialModule } from './material.module';

@NgModule({
  imports: [CommonModule, MaterialModule],
  exports: [CommonModule, MaterialModule, AddressComponent, ContactComponent],
  declarations: [AddressComponent, ContactComponent]
})
export class SharedModule {}
