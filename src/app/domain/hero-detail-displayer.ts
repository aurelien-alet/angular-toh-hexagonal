import { Inject, Injectable } from "@angular/core";
import { catchError, map, Observable, tap, throwError } from "rxjs";
import ErrorsHandler from "./errors-handler";
import { Hero } from "./models/hero";
import IDisplayHeroDetail from "./ports/i-display-hero-detail";
import IManageHeroes from "./ports/i-manage-heroes";
import IManageMessages from "./ports/i-manage-messages";

@Injectable()
export default class HeroDetailDisplayer implements IDisplayHeroDetail {
    
    hero: Hero | undefined = undefined;
    
    constructor(
      private _errorHandler: ErrorsHandler,
      @Inject('IManageHeroes') private _heroesManager: IManageHeroes,
      @Inject('IManageMessages') private _messagesManager: IManageMessages,
    ) {}

    askHeroDetail(id: number): Observable<void> {
        return this._heroesManager.getHero(id).pipe(
            tap(_ => this._messagesManager.add(`fethed hero id=${id}`)),
            catchError(this._errorHandler.handleError<Hero>(`getHero id=${id}`)),
            map(hero => {this.hero = hero})
        );
    }
    
    askHeroNameChange(newHeroName: string): Observable<void> {
        if( this.hero === undefined ){
          return throwError(() => new Error('No hero selected!'));
        }
        const updatedHero = {id: this.hero.id, name: newHeroName};
        return this._heroesManager.updateHero(updatedHero).pipe(
            tap(_ => this._messagesManager.add(`updated hero id=${this.hero ? this.hero.id : 0}`)),
            catchError(this._errorHandler.handleError<any>(`updateHero id=${this.hero.id}`, this.hero)),
            map(hero => {if(this.hero){this.hero.name = hero.name}})
        );
    }
}