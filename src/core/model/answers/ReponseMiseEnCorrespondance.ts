import { Answer } from "./Reponse";

export class AnswerAssociation extends Answer{

    constructor(reponse: number[][], bonneReponseText: string, mauvaiseReponseText:string) {
        super(reponse,bonneReponseText,mauvaiseReponseText)
    }

    public modifier(reponseJson : string){
        let values = JSON.parse(reponseJson);
        this.reponse = values.reponse;
        this.bonneReponseText = values.descriptionReponse; 
        this.mauvaiseReponseText = values.mauvaiseReponseDescription;
    }

}