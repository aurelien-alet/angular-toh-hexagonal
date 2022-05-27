import { Observable } from "rxjs"
import { Hero } from "src/app/domain/models/hero"

export default interface IManageHeroes {

    getHeroes(): Observable<Hero[]>
    searchHeroes(term: string): Observable<Hero[]>
    getHero(id: number): Observable<Hero> 
    addHero(hero: Hero): Observable<Hero>
    updateHero(hero: Hero): Observable<Hero>
    deleteHero(id: number): Observable<number>

}