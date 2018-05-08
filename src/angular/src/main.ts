import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import 'hammerjs';

const materialIconLink = document.createElement('link');
materialIconLink.rel = 'stylesheet';
materialIconLink.href = environment.materialIconFont;
document.head.appendChild(materialIconLink);

const robotoFontLink = document.createElement('link');
robotoFontLink.rel = 'stylesheet';
robotoFontLink.href = environment.robotoIconFont;
document.head.appendChild(robotoFontLink);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.log(err));
