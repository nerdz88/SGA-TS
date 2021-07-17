import { Answer } from "./Reponse";

export class AnswerReponseCourte extends Answer{

    constructor(reponse: number[][], bonneReponseText: string, mauvaiseReponseText:string) {
        super(reponse,bonneReponseText,mauvaiseReponseText)
    }

    public modifier(reponseJson : string) {
        let values = JSON.parse(reponseJson);
        this.reponse = values._reponse;
        this.bonneReponseText = values._bonneReponseText;
        this.mauvaiseReponseText = values._mauvaiseReponseText;
    }

    

}