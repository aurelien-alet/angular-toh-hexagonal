import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from '../adapters/in-memory-data.service';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { HeroesComponent } from './heroes/heroes.component';
import { HeroSearchComponent } from './hero-search/hero-search.component';
import { MessagesComponent } from './messages/messages.component';
import { HeroAdapterService } from '../adapters/hero-adapter.service';
import { MessageAdapterService } from '../adapters/message-adapter.service';
import HeroDetailDisplayer from '../domain/hero-detail-displayer';
import HeroesDisplayer from '../domain/heroes-displayer';
import MessagesDisplayer from '../domain/messages-displayer';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,

    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    )
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    HeroesComponent,
    HeroDetailComponent,
    MessagesComponent,
    HeroSearchComponent
  ],
  providers: [
    
    // Inject domain classes into components
    {provide: 'IDisplayHeroDetail', useClass: HeroDetailDisplayer},
    {provide: 'IDisplayHeroes', useClass: HeroesDisplayer},
    {provide: 'IDisplayHeroesSearch', useClass: HeroesDisplayer},
    {provide: 'IDisplayMessages', useClass: MessagesDisplayer},
    
    // Inject asapters int domain classes
    {provide: 'IManageHeroes', useClass: HeroAdapterService},
    {provide: 'IManageMessages', useClass: MessageAdapterService}
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
