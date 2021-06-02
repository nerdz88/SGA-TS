import { InvalidParameterError } from '../errors/InvalidParameterError';

export enum TYPES {
    COURS="Cours",
    DEVOIR="Devoir",
    QUESTIONNAIRE = "Questionnaire",
    QUESTION = "Question"
}
export abstract class Operation<T> {
    protected operationObject : T[];

    constructor(){
        this.operationObject = [];
    }

    abstract creerObjet(params : any): void

    abstract supprimerObjet(params : any): void

    abstract recupererObjet(params : any) : any

    abstract recupererObjetParId(id : any) :any

    abstract recupererJsonSGB(params : any) : any

    abstract updateObjet(params : any) : void
}