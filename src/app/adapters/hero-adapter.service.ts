import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, Observable } from 'rxjs';

import { Hero } from '../domain/models/hero';
import { HeroOperationError } from '../domain/errors/hero-operation-error';
import IManageHeroes from '../domain/ports/i-manage-heroes';


@Injectable({ providedIn: 'root' })
export class HeroAdapterService implements IManageHeroes {

  private heroesUrl = 'api/heroes';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  /** GET heroes from the server */
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      catchError(this.handleHttpError())
    );
  }

  /** GET hero by id. Will 404 if id not found */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      catchError(this.handleHttpError())
    );
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      catchError(this.handleHttpError())
    );
  }

  //////// Save methods //////////

  /** POST: add a new hero to the server */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      catchError(this.handleHttpError())
    );
  }

  /** DELETE: delete the hero from the server */
  deleteHero(id: number): Observable<number> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      catchError(this.handleHttpError()),
      // returns the deleted hero id
      map(_ => id)
    );
  }

  /** PUT: update the hero on the server */
  updateHero(hero: Hero): Observable<Hero> {
    return this.http.put<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      catchError(this.handleHttpError()),
      // returns the modified hero
      map(_ => hero)
    );
  }

  /**
   * Handle Http operation that failed.
   * Throw an HeroOperation
   */
   private handleHttpError() {
    return (error: any): Observable<any> => {
      throw new HeroOperationError(error.body.error);
    };
  }

}
