import { ReponseChoixMultiple } from "../reponses/ReponseChoixMultiple";
import { Question } from "./Question";

export class QuestionChoixMultiple extends Question {
    constructor(questionJson: string) {
        super(questionJson)
        let values = JSON.parse(questionJson)
        JSON.parse(values.reponses).forEach( reponse => {
            let answer = new ReponseChoixMultiple(reponse.reponse,/*reponse.ponderation,*/reponse.descriptionReponse,reponse.descriptionMauvaiseReponse,reponse.choix);
            this._answerChoix.push(answer);
        });
    }

    public modifier(questionJson: string) {
        super.modifier(questionJson);
        let values = JSON.parse(questionJson)
        this._answerChoix=[];
        JSON.parse(values.reponses).forEach( reponse => {
            let answer = new ReponseChoixMultiple(reponse.reponse,/*reponse.ponderation,*/reponse.descriptionReponse,reponse.descriptionMauvaiseReponse,reponse.choix);
            this._answerChoix.push(answer);
        });
    }

}