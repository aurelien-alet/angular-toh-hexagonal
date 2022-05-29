import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from '../adapters/in-memory-data.service';

import { ComponentsModule } from './components.module';

import { AdminAppComponent } from './admin-app.component';
import { HeroAdapterService } from '../adapters/hero-adapter.service';
import { MessageAdapterService } from '../adapters/message-adapter.service';
import HeroDetailDisplayer from '../domain/hero-detail-displayer';
import HeroesDisplayer from '../domain/heroes-displayer';
import MessagesDisplayer from '../domain/messages-displayer';

@NgModule({
  imports: [
    ComponentsModule,
    HttpClientModule,

    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    )
  ],
  declarations: [
    AdminAppComponent,
  ],
  providers: [
    
    // Inject domain classes into components
    {provide: 'IDisplayHeroDetail', useClass: HeroDetailDisplayer},
    {provide: 'IDisplayHeroes', useClass: HeroesDisplayer},
    {provide: 'IDisplayMessages', useClass: MessagesDisplayer},
    
    // Inject asapters int domain classes
    {provide: 'IManageHeroes', useClass: HeroAdapterService},
    {provide: 'IManageMessages', useClass: MessageAdapterService}
  ],
  bootstrap: [ AdminAppComponent ]
})
export class AdminAppModule { }
