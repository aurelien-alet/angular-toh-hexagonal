import { Observable } from "rxjs"
import { Hero } from "src/app/domain/models/hero"

export default interface IDisplayHeroes {

    heroes: Hero[]
    filter: string
    
    askHeroesList(): Observable<void>
    askHeroesFiltered(filter: string, allowEmpty?: boolean): Observable<void>
    askHeroCreation(heroName: string): Observable<void>
    askHeroDeletion(hero: Hero): Observable<void>

}