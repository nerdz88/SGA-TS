import { ReponseMiseEnCorrespondance } from "../reponses/ReponseMiseEnCorrespondance";
import { Question } from "./Question";
export class QuestionAssociation extends Question {

    private isShuffled: boolean;

    constructor(questionJson: string) {
        super(questionJson)
        let values = JSON.parse(questionJson)
        this.isShuffled = values.isShuffled;
        this._answerChoix = values.reponse.forEach( reponse => {
            let answer = new ReponseMiseEnCorrespondance(reponse.reponse,reponse.descriptionBonneReponse,reponse.descriptionMauvaiseReponse);
            this._answerChoix.push(answer);
        });
    }

    public modifier(questionJson: string) {
        super.modifier(questionJson);
        let values = JSON.parse(questionJson)
        this.isShuffled = values.isShuffled;
        this._answerChoix = values.reponse.forEach( reponse => {
            let answer = new ReponseMiseEnCorrespondance(reponse.reponse,reponse.descriptionBonneReponse,reponse.descriptionMauvaiseReponse);
            this._answerChoix.push(answer);
        });
    }

    public getIsShuffled(): boolean {
        return this.isShuffled
    }

    public setShuffled(isShuffled: boolean) {
        this.isShuffled = isShuffled;
    }

}