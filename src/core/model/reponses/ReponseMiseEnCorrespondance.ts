import { Reponse } from "./Reponse";

export class ReponseMiseEnCorrespondance extends Reponse {

    private correspondance: string;

    constructor(reponse: string, bonneReponseText: string, mauvaiseReponseText: string, correspondance: string) {
        super(reponse, bonneReponseText, mauvaiseReponseText);
        this.correspondance = correspondance;
    }

    public modifier(reponseJson: string) {
        let values = JSON.parse(reponseJson);
        this.reponse = values._reponse;
        this.bonneReponseText = values._bonneReponseText;
        this.mauvaiseReponseText = values._mauvaiseReponseText;

    }
    public getCorrespondance(): string {
        return this.correspondance;
    }

}