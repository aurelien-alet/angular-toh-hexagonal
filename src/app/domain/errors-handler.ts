import { Inject, Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { HeroOperationError } from "./errors/hero-operation-error";
import IManageMessages from "./ports/i-manage-messages";

@Injectable({ providedIn: 'root' })
export default class ErrorsHandler {
    
    constructor(
        @Inject('IManageMessages') private _messagesManager: IManageMessages,
    ) {}
    
    /**
     * Handle adapter operation that failed.
     * Let the app continue.
     *
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    public handleError<T>(operation = 'operation', result?: T) {
        return (error: HeroOperationError): Observable<T> => {
            console.error(error);
            this._messagesManager.add(`${operation} failed. ${error}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}