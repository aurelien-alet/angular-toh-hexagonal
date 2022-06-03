import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, Observable, of, throwError } from 'rxjs';

import { Hero } from '../domain/models/hero';
import { HeroOperationError } from '../domain/errors/hero-operation-error';
import IManageHeroes from '../domain/ports/i-manage-heroes';


@Injectable({ providedIn: 'root' })
export class SuperheroApiAdapterService implements IManageHeroes {

  private heroesUrl = 'https://akabab.github.io/superhero-api/api';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  /** GET heroes from the server */
  getHeroes(): Observable<Hero[]> {
    const url = `${this.heroesUrl}/all.json`;
    return this.http.get<Hero[]>(url).pipe(
      catchError(this.handleHttpError()),
      map(apiResponse => {
        let heroes: Hero[] = []
        apiResponse.forEach((el: any) => {
          heroes.push({'id': el.id, 'name': el.name});
        });
        return heroes;
      })
    );
  }

  /** GET hero by id. Will 404 if id not found */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/id/${id}.json`;
    return this.http.get<Hero>(url).pipe(
      catchError(this.handleHttpError()),
      map(apiResponse => { return {'id': apiResponse.id, 'name': apiResponse.name}})
    );
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    term = term.toLowerCase();
    return this.getHeroes().pipe(
      map(
        // search is handled locally as API doesn't offer a search endpoint
        (heroes: Hero[]) => heroes.filter(h => h.name.toLowerCase().indexOf(term) !== -1)
        )
    )
  }

  //////// Save methods //////////

  /** POST: add a new hero to the server */
  addHero(hero: Hero): Observable<Hero> {
    return throwError(() => new HeroOperationError('Add not handled by this API'));
  }

  /** DELETE: delete the hero from the server */
  deleteHero(id: number): Observable<number> {
    return throwError(() => new HeroOperationError('Delete not handled by this API'));
  }

  /** PUT: update the hero on the server */
  updateHero(hero: Hero): Observable<Hero> {
    return throwError(() => new HeroOperationError('Update not handled by this API'));
  }

  /**
   * Handle Http operation that failed.
   * Throw an HeroOperation
   */
   private handleHttpError() {
    return (error: any): Observable<any> => {
      throw new HeroOperationError(error.message);
    };
  }

}
