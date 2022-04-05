import { Component, Inject, OnInit } from '@angular/core';
import IDisplayHeroes from 'src/app/domain/ports/i-display-heroes';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {

  constructor(
    @Inject('IDisplayHeroes') public heroesDisplayer: IDisplayHeroes
  ) { }

  ngOnInit(): void {
    this.heroesDisplayer.askHeroesList().subscribe();
  }

}