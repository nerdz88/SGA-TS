import { Reponse } from "./Reponse";

export class ReponseChoixMultiple extends Reponse {

    private ponderation: number;
    private choix: string;
    constructor(reponse: boolean, /*ponderation : number,*/ bonneReponseText: string, mauvaiseReponseText: string, choix: string) {
        super(reponse, bonneReponseText, mauvaiseReponseText);
        this.choix = choix;
        //this.ponderation = ponderation;
    }

    public getChoix(): string {
        return this.choix;
    }

    public getPonderation(): number {
        return this.ponderation;
    }

    public setPonderation(ponderation: number): void {
        this.ponderation = ponderation;
    }

    public modifier(reponseJson: string) {
        let values = JSON.parse(reponseJson);
        //this.ponderation = values.ponderation;
        this.reponse = values._reponse;
        this.bonneReponseText = values._bonneReponseText;
        this.mauvaiseReponseText = values._mauvaiseReponseText;
    }

}