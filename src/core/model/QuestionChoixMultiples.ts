import { Question } from "./Question";

export class QuestionChoixMultiple extends Question {

    private _choix: string[]
    private _reponses: number[]
    
    constructor(questionJson: string) {
        super(questionJson)
        
        let values = JSON.parse(questionJson)
        this._choix = values.choix;
        this._reponses = values.reponses;

    }

	public getChoix():string[] {
    return this._choix;
    }

	public setVhoix(choix: string[]) {
    this._choix = choix;
        }

	public getreponses() :number[]{
    return this._reponses
}

	public setreponses(reponses: number[]) {
    this._reponses = reponses;
}



}