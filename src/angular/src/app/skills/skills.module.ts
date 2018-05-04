import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaterialModule } from '../shared/material.module';
import { SkillsRoutingModule } from './skills-routing.module';
import { SkillsComponent } from './skills.component';

@NgModule({
  imports: [CommonModule, MaterialModule, SkillsRoutingModule],
  declarations: [SkillsComponent]
})
export class SkillsModule {}
