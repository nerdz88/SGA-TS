import { ReponseNumerique } from "../reponses/ReponseNumerique";
import { Tentative } from "../Tentative";
import { Pointage } from "./Pointage";
import { Question } from "./Question";
import { QuestionEssaie } from "./QuestionEssaie";

export class QuestionNumerique extends Question {

    constructor(questionJson: string) {
        super(questionJson)
        if (questionJson == undefined)
            return;
        let values = JSON.parse(questionJson)
        JSON.parse(values.reponses).forEach( reponse => {
            let answer = new ReponseNumerique(reponse.reponse,reponse.descriptionReponse,reponse.descriptionMauvaiseReponse);
            this._answerChoix.push(answer);
        });
    }

    public modifier(questionJson: string) {
        super.modifier(questionJson);
        let values = JSON.parse(questionJson);
        this._answerChoix=[];
        JSON.parse(values.reponses).forEach( reponse => {
            let answer = new ReponseNumerique(reponse.reponse,reponse.descriptionReponse,reponse.descriptionMauvaiseReponse);
            this._answerChoix.push(answer);
        });
    }

    public corriger(tentative: Tentative): Pointage {    
        return new Pointage(0, 0);
    }
}