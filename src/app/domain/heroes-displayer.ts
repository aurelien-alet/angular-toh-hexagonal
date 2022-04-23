import { Inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of, tap } from "rxjs";
import ErrorsHandler from "./errors-handler";
import { Hero } from "./models/hero";
import IDisplayHeroes from "./ports/i-display-heroes";
import IManageHeroes from "./ports/i-manage-heroes";
import IManageMessages from "./ports/i-manage-messages";

@Injectable()
export default class HeroesDisplayer implements IDisplayHeroes {
    
    heroes: Hero[] = [];
    
    constructor(
        private _errorHandler: ErrorsHandler,
        @Inject('IManageHeroes') private _heroesManager: IManageHeroes,
        @Inject('IManageMessages') private _messagesManager: IManageMessages,
    ) {}

    askHeroesList(): Observable<void> {
        return this._heroesManager.getHeroes().pipe(
            tap(_ => this._messagesManager.add("fetched heroes")),
            catchError(this._errorHandler.handleError<Hero[]>('getHeroes', [])),
            map(heroes => {this.heroes = heroes})
        );
    }

    askHeroesFiltered(filter: string): Observable<void> {
        if (!filter.trim()) {
            // if not filter string, return empty hero array.
            this.heroes = [];
            return of();
        }
        return this._heroesManager.searchHeroes(filter).pipe(
            tap((heroes: Hero[]) => heroes.length ?
                this._messagesManager.add(`found heroes matching "${filter}"`) :
                this._messagesManager.add(`no heroes matching "${filter}"`)),
            catchError(this._errorHandler.handleError<Hero[]>('searchHeroes', [])),
            map(heroes => {this.heroes = heroes})
        );
    }

    askHeroCreation(heroName: string): Observable<void> {
        heroName = heroName.trim();
        return this._heroesManager.addHero({name: heroName} as Hero).pipe(
            tap((newHero: Hero) => this._messagesManager.add(`added hero w/ id=${newHero.id}`)),
            catchError(this._errorHandler.handleError<Hero>('addHero')),
            map(hero => {this.heroes.push(hero)}),
        );
    }
    
    askHeroDeletion(hero: Hero): Observable<void> {
        return this._heroesManager.deleteHero(hero.id).pipe(
            tap(_ => this._messagesManager.add(`deleted hero id=${hero.id}`)),
            catchError(this._errorHandler.handleError<Hero>('deleteHero')),
            map(_ => {this.heroes = this.heroes.filter(h => h !== hero)})
        );
    }

}