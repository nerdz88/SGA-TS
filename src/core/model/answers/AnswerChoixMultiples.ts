import { Answer } from "./Answer";

export class AnswerChoixMultiples extends Answer{

    private ponderation : number;

    constructor(reponse : boolean, ponderation : number, bonneReponseText:string, mauvaiseReponseText: string) {
        super(reponse,bonneReponseText,mauvaiseReponseText);
        this.ponderation = ponderation;
    }

    public getPonderation(): number {
        return this.ponderation;
    }

    public setPonderation(ponderation: number): void {
        this.ponderation = ponderation;
    }

    public modifier(reponseJson : string){
        let values = JSON.parse(reponseJson);
        this.reponse = values.reponse;
        this.ponderation = values.ponderation;
        this.bonneReponseText = values.descriptionReponse; 
        this.mauvaiseReponseText = values.mauvaiseReponseDescription;
    }
    
}