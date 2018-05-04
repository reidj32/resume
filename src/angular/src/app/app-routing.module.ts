import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: 'about', loadChildren: './about/about.module#AboutModule' },
  { path: 'skills', loadChildren: './skills/skills.module#SkillsModule' },
  {
    path: 'experience',
    loadChildren: './experience/experience.module#ExperienceModule'
  },
  {
    path: 'education',
    loadChildren: './education/education.module#EducationModule'
  },
  { path: '', pathMatch: 'full', redirectTo: 'about' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
