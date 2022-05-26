import { Observable } from "rxjs"
import { Hero } from "src/app/domain/models/hero"

export default interface IDisplayHeroDetail {

    hero: Hero | undefined

    askHeroDetail(id: number): Observable<void>
    askHeroNameChange(newHeroName: string): Observable<void>
}