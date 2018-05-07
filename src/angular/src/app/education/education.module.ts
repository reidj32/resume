import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { EducationRoutingModule } from './/education-routing.module';
import { EducationComponent } from './education.component';

@NgModule({
  imports: [SharedModule, EducationRoutingModule],
  declarations: [EducationComponent]
})
export class EducationModule {}
