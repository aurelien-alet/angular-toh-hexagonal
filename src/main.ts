import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/components/app.module';
import { SuperheroApiAppModule } from './app/components/superhero-api-app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

let mainModule: any;
if (environment.heroAdapter === "superhero-api"){
  mainModule = SuperheroApiAppModule;
} else {
  mainModule = AppModule;
}

platformBrowserDynamic().bootstrapModule(mainModule)
  .catch(err => console.error(err));
