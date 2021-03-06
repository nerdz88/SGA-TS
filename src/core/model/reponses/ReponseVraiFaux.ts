import { Reponse } from "./Reponse";

export class ReponseVraiFaux extends Reponse {

    constructor(reponse: number[][], bonneReponseText: string, mauvaiseReponseText: string) {
        super(reponse, bonneReponseText, mauvaiseReponseText)
    }

    public modifier(reponseJson: string) {
        let values = JSON.parse(reponseJson);
        this.reponse = values._reponse;
        this.bonneReponseText = values._bonneReponseText;
        this.mauvaiseReponseText = values._mauvaiseReponseText;
    }
}