import { ReponseVraiFaux } from "../reponses/ReponseVraiFaux";
import { Question } from "./Question";

export class QuestionVraiFaux extends Question {

    constructor(questionJson: string) {
        super(questionJson)
        let values = JSON.parse(questionJson)
        this._answerChoix = values.reponse.forEach( reponse => {
            let answer = new ReponseVraiFaux(reponse.reponse,reponse.descriptionBonneReponse,reponse.descriptionMauvaiseReponse);
            this._answerChoix.push(answer);
        });
    }

    public modifier(questionJson: string) {
        super.modifier(questionJson);
        let values = JSON.parse(questionJson)
        this._answerChoix = values.reponse.forEach( reponse => {
            let answer = new ReponseVraiFaux(reponse.reponse,reponse.descriptionBonneReponse,reponse.descriptionMauvaiseReponse);
            this._answerChoix.push(answer);
        });
    }
}