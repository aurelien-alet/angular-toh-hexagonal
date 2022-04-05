import { Inject, Injectable } from "@angular/core";
import { catchError, Observable, of, Subscription, tap } from "rxjs";
import ErrorsHandler from "./errors-handler";
import { Hero } from "./models/hero";
import IDisplayHeroDetail from "./ports/i-display-hero-detail";
import IManageHeroes from "./ports/i-manage-heroes";
import IManageMessages from "./ports/i-manage-messages";

@Injectable()
export default class HeroDetailDisplayer implements IDisplayHeroDetail {
    
    hero: Hero | null = null;
    
    constructor(
      private _errorHandler: ErrorsHandler,
      @Inject('IManageHeroes') private _heroesManager: IManageHeroes,
      @Inject('IManageMessages') private _messagesManager: IManageMessages,
    ) {}

    askHeroDetail(id: number): Observable<any> {
        return this._heroesManager.getHero(id).pipe(
            tap(_ => this._messagesManager.add(`fethed hero id=${id}`)),
            tap(hero => this.hero = hero),
            catchError(this._errorHandler.handleError<Hero>(`getHero id=${id}`))
        );
    }
    
    askHeroNameChange(newHeroName: string): Observable<any> {
        if( this.hero === null ){
          throw 'No hero selected!';
        }
        return this._heroesManager.updateHero(this.hero).pipe(
            tap(_ => {if(this.hero){this.hero.name = newHeroName}}),
            tap(_ => this._messagesManager.add(`updated hero id=${this.hero ? this.hero.id : 0}`)),
            catchError(this._errorHandler.handleError<any>('updateHero'))
        );
    }

}