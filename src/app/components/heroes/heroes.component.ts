import { Component, Inject, OnInit } from '@angular/core';
import IDisplayHeroes from 'src/app/domain/ports/i-display-heroes';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  constructor(
    @Inject('IDisplayHeroes') public heroesDisplayer: IDisplayHeroes
  ) { }
  
  ngOnInit(): void {
    this.heroesDisplayer.askHeroesList().subscribe();
  }

}
