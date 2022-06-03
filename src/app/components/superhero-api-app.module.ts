import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';

import { ComponentsModule } from './components.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { MessageAdapterService } from '../adapters/message-adapter.service';
import HeroDetailDisplayer from '../domain/hero-detail-displayer';
import HeroesDisplayer from '../domain/heroes-displayer';
import MessagesDisplayer from '../domain/messages-displayer';
import { SuperheroApiAdapterService } from '../adapters/superhero-api-adapter.service';

@NgModule({
  imports: [
    AppRoutingModule,
    ComponentsModule,
    HttpClientModule,
  ],
  providers: [
    
    // Inject domain classes into components
    {provide: 'IDisplayHeroDetail', useClass: HeroDetailDisplayer},
    {provide: 'IDisplayHeroes', useClass: HeroesDisplayer},
    {provide: 'IDisplayHeroesSearch', useClass: HeroesDisplayer},
    {provide: 'IDisplayMessages', useClass: MessagesDisplayer},
    
    // Inject asapters int domain classes
    {provide: 'IManageHeroes', useClass: SuperheroApiAdapterService},
    {provide: 'IManageMessages', useClass: MessageAdapterService}
  ],
  bootstrap: [ AppComponent ]
})
export class SuperheroApiAppModule { }