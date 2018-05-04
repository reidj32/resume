import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaterialModule } from '../shared/material.module';
import { EducationRoutingModule } from './/education-routing.module';
import { EducationComponent } from './education.component';

@NgModule({
  imports: [CommonModule, MaterialModule, EducationRoutingModule],
  declarations: [EducationComponent]
})
export class EducationModule {}
