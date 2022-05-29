import { Component, Inject, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, finalize, Subject, tap } from 'rxjs';
import { Hero } from 'src/app/domain/models/hero';

import IDisplayHeroes from 'src/app/domain/ports/i-display-heroes';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: [ './admin-panel.component.css' ]
})
export class AdminPanelComponent implements OnInit {
  public filterTerms = new Subject<string>();
  public selectedHero: Hero | null = null;

  constructor(
    @Inject('IDisplayHeroes') public heroesDisplayer: IDisplayHeroes
  ) {}

  ngOnInit(): void {
    this.heroesDisplayer.askHeroesList().subscribe();
    this.filterTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // ask hero list filtered each time the term changes
      tap((term: string) => this.heroesDisplayer.askHeroesFiltered(term, true).subscribe())

    ).subscribe();
  }

  loadHeroes(): void{
    this.heroesDisplayer.askHeroesList().subscribe();
  }

}
