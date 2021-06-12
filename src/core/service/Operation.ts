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

    abstract creerObjet(element: string, token?: string)

    /**
     * 
     * @param id recoit id qu'on veut supprimer
     * @param secondId optionnel 
     */
    abstract supprimerObjet(id: any, secondId?: any): boolean

    abstract updateObjet(id: number, newElement: any)

    public recupererObjet(): string {
        let value = "[]";
        if (this.operationObject == undefined || this.operationObject.length == 0) {
            return value;
        }
        value = JSON.stringify(this.operationObject);
        return value;
    }

    abstract recupererObjetParId(id: any): string
}