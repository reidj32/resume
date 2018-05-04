import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaterialModule } from '../shared/material.module';
import { ExperienceRoutingModule } from './/experience-routing.module';
import { ExperienceComponent } from './experience.component';

@NgModule({
  imports: [CommonModule, MaterialModule, ExperienceRoutingModule],
  declarations: [ExperienceComponent]
})
export class ExperienceModule {}
