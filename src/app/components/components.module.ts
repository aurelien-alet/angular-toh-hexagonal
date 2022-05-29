import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { HeroesComponent } from './heroes/heroes.component';
import { HeroSearchComponent } from './hero-search/hero-search.component';
import { MessagesComponent } from './messages/messages.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { HeroEditComponent } from './hero-edit/hero-edit.component';

@NgModule({
  imports: [
    FormsModule,
    RouterModule,
    BrowserModule
  ],
  declarations: [
    DashboardComponent,
    HeroesComponent,
    HeroDetailComponent,
    MessagesComponent,
    HeroSearchComponent,
    AdminPanelComponent,
    HeroEditComponent
],
exports: [
    DashboardComponent,
    HeroesComponent,
    HeroDetailComponent,
    MessagesComponent,
    HeroSearchComponent,
    AdminPanelComponent,
    HeroEditComponent
  ]
})
export class ComponentsModule { }
