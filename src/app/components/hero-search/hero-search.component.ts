import { Component, Inject, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import {
  debounceTime, distinctUntilChanged, tap
} from 'rxjs/operators';

import IDisplayHeroes from 'src/app/domain/ports/i-display-heroes';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: [ './hero-search.component.css' ]
})
export class HeroSearchComponent implements OnInit {
  private searchTerms = new Subject<string>();

  constructor(
    @Inject('IDisplayHeroesSearch') public heroesDisplayer: IDisplayHeroes
  ) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.searchTerms.pipe(

      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // ask hero list filtered each time the term changes
      tap((term: string) => this.heroesDisplayer.askHeroesFiltered(term).subscribe())
    
    ).subscribe();

    // reinitialise filter
    this.searchTerms.next('');
  }
}
