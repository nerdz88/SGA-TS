import { AnswerReponseCourte } from "../answers/AnswerReponseCourte";
import { Question } from "./Question";

export class QuestionReponseCourte extends Question {

    constructor(questionJson: string) {
        super(questionJson)
        let values = JSON.parse(questionJson)
        this._answerChoix = values.reponse.forEach( reponse => {
            let answer = new AnswerReponseCourte(reponse.reponse,reponse.descriptionBonneReponse,reponse.descriptionMauvaiseReponse);
            this._answerChoix.push(answer);
        });
    }

    public modifier(questionJson: string) {
        super.modifier(questionJson);
        let values = JSON.parse(questionJson)
        this._answerChoix = values.reponse.forEach( reponse => {
            let answer = new AnswerReponseCourte(reponse.reponse,reponse.descriptionBonneReponse,reponse.descriptionMauvaiseReponse);
            this._answerChoix.push(answer);
        });
    }
}