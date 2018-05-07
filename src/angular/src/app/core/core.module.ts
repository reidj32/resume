import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { ActivePageService } from './services/active-page.service';
import { ResumeService } from './services/resume.service';

@NgModule({
  imports: [CommonModule],
  providers: [ResumeService, ActivePageService]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
