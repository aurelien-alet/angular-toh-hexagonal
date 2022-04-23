import { Inject, Injectable } from "@angular/core";
import { catchError, map, Observable, tap } from "rxjs";
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

    askHeroDetail(id: number): Observable<void> {
        return this._heroesManager.getHero(id).pipe(
            tap(_ => this._messagesManager.add(`fethed hero id=${id}`)),
            catchError(this._errorHandler.handleError<Hero>(`getHero id=${id}`)),
            map(hero => {this.hero = hero})
        );
    }
    
    askHeroNameChange(newHeroName: string): Observable<void> {
        if( this.hero === null ){
          throw 'No hero selected!';
        }
        return this._heroesManager.updateHero(this.hero).pipe(
            tap(_ => this._messagesManager.add(`updated hero id=${this.hero ? this.hero.id : 0}`)),
            catchError(this._errorHandler.handleError<any>('updateHero')),
            map(_ => {if(this.hero){this.hero.name = newHeroName}})
        );
    }

}