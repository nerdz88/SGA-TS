import { ReponseCourte } from "../reponses/ReponseCourte";
import { Question } from "./Question";

export class QuestionEssaie extends Question {

    constructor(questionJson: string) {
        super(questionJson)
        let values = JSON.parse(questionJson)
        /*JSON.parse(values.reponses).forEach( reponse => {
            let answer = new ReponseCourte(reponse.reponse,reponse.descriptionReponse,reponse.descriptionMauvaiseReponse);
            this._answerChoix.push(answer);
        });*/
    }

    public modifier(questionJson: string) {
        super.modifier(questionJson);
        let values = JSON.parse(questionJson);
        /*this._answerChoix=[];
        JSON.parse(values.reponses).forEach( reponse => {
            let answer = new ReponseCourte(reponse.reponse,reponse.descriptionReponse,reponse.descriptionMauvaiseReponse);
            this._answerChoix.push(answer);
        });*/
    }
}