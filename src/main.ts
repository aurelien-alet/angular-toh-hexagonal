import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/components/app.module';
import { AdminAppModule } from './app/components/admin-app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

let mainModule: any;
if (environment.profile === "admin"){
  mainModule = AdminAppModule;
} else {
  mainModule = AppModule;
}

platformBrowserDynamic().bootstrapModule(mainModule)
  .catch(err => console.error(err));
