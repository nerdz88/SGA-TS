import { AnswerChoixMultiples } from "../answers/ReponseChoixMultiple";
import { Question } from "./Question";

export class QuestionChoixMultiple extends Question {

    private _choix: string[]

    constructor(questionJson: string) {
        super(questionJson)
        let values = JSON.parse(questionJson)
        this._choix = values.choix;
        this._answerChoix = values.reponse.forEach( reponse => {
            let answer = new AnswerChoixMultiples(reponse.reponse,reponse.ponderation,reponse.descriptionBonneReponse,reponse.descriptionMauvaiseReponse);
            this._answerChoix.push(answer);
        });
    }
    public getChoix(): string[] {
        return this._choix;
    }

    public modifier(questionJson: string) {
        super.modifier(questionJson);
        let values = JSON.parse(questionJson)
        this._choix = values.choix;
        this._answerChoix = values.reponse.forEach( reponse => {
            let answer = new AnswerChoixMultiples(reponse.reponse,reponse.ponderation,reponse.descriptionBonneReponse,reponse.descriptionMauvaiseReponse);
            this._answerChoix.push(answer);
        });
    }

    public setChoix(choix: string[]) {
        this._choix = choix;
    }

}