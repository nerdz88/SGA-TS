import { InvalidParameterError } from '../errors/InvalidParameterError';

export enum TYPES {
    COURS = "Cours",
    DEVOIR = "Devoir",
    QUESTIONNAIRE = "Questionnaire",
    QUESTION = "Question"
}
export abstract class Operation<T> {
    protected operationObject: T[];

    constructor() {
        this.operationObject = new Array()
    }

    abstract creerObjet(params: any)

    abstract supprimerObjet(params: any) : boolean

    abstract updateObjet(id : number, params: any) 

    public recupererObjet(params?: any): string{
        let value="[]";
        if(this.operationObject==undefined || this.operationObject.length==0){
            return value;
        }
        value=JSON.stringify(this.operationObject);
        return value;
    }

    abstract recupererObjetParId(id: any): any

    abstract recupererJsonSGB(params: any): any

    //abstract updateObjet(params : any) : void
}