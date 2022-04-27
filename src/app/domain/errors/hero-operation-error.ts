export class HeroOperationError extends Error {
    constructor(message: string){
        super(message);
        this.name = 'HeroOperationError';
    }
}