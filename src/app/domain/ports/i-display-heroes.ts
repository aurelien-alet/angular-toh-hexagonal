import { Observable } from "rxjs"
import { Hero } from "src/app/domain/models/hero"

export default interface IDisplayHeroes {

    heroes: Hero[]
    
    askHeroesList(): Observable<any>
    askHeroesFiltered(filter: string): Observable<any>
    askHeroCreation(heroName: string): Observable<any>
    askHeroDeletion(hero: Hero): Observable<any>

}