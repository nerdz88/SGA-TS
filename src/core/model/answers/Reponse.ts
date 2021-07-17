export abstract class Answer {
       
    protected reponse: any;
    protected bonneReponseText: string;
    protected mauvaiseReponseText: string;


    
    constructor(reponse: any, bonneReponseText: string, mauvaiseReponseText: string) {
        this.reponse = reponse;
        this.bonneReponseText= bonneReponseText;
        this.mauvaiseReponseText = mauvaiseReponseText;
    }


    public getReponse(): any {
        return this.reponse;
    }

    public setReponse(reponse: any): void {
        this.reponse = reponse;
    }

    public getBonneReponseText(): string {
        return this.bonneReponseText;
    }

    public setBonneReponseText(bonneReponseText: string): void {
        this.bonneReponseText = bonneReponseText;
    }

    public getMauvaiseReponseText(): string {
        return this.mauvaiseReponseText;
    }

    public setMauvaiseReponseText(mauvaiseReponseText: string): void {
        this.mauvaiseReponseText = mauvaiseReponseText;
    }
    abstract modifier(reponseJson : string);

    

}