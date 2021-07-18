import { Reponse } from "./Reponse";

export class ReponseNumerique extends Reponse{

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