import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ExperienceRoutingModule } from './/experience-routing.module';
import { ExperienceComponent } from './experience.component';
import { PositionComponent } from './position/position.component';

@NgModule({
  imports: [SharedModule, ExperienceRoutingModule],
  declarations: [ExperienceComponent, PositionComponent]
})
export class ExperienceModule {}
