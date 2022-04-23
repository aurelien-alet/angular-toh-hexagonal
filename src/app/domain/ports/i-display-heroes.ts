import { Observable } from "rxjs"
import { Hero } from "src/app/domain/models/hero"

export default interface IDisplayHeroes {

    heroes: Hero[]
    
    askHeroesList(): Observable<void>
    askHeroesFiltered(filter: string): Observable<void>
    askHeroCreation(heroName: string): Observable<void>
    askHeroDeletion(hero: Hero): Observable<void>

}