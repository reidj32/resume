import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import 'hammerjs';

if (environment.production) {
  const gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=UA-120214520-1';

  const gtagScriptInit = document.createElement('script');
  gtagScriptInit.innerHTML =
    'window.dataLayer=window.dataLayer||[];' +
    'function gtag(){dataLayer.push(arguments);}' +
    'gtag("js",new Date());' +
    'gtag("config","UA-120214520-1");';

  document.head.appendChild(gtagScript);
  document.head.appendChild(gtagScriptInit);
}

const faviconLink = document.createElement('link');
faviconLink.rel = 'icon';
faviconLink.type = 'image/x-icon';
faviconLink.href = environment.faviconLink;
document.head.appendChild(faviconLink);

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
