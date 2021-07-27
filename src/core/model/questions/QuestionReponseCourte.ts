import { ReponseCourte } from "../reponses/ReponseCourte";
import { Tentative } from "../Tentative";
import { Pointage } from "./Pointage";
import { Question } from "./Question";
import { QuestionEssaie } from "./QuestionEssaie";

export class QuestionReponseCourte extends Question {

    constructor(questionJson: string) {
        super(questionJson)
        if (questionJson == undefined)
            return;
        let values = JSON.parse(questionJson)
        values.reponses.forEach( reponse => {
            let answer = new ReponseCourte(reponse.reponse,reponse.descriptionReponse,reponse.descriptionMauvaiseReponse);
            this._answerChoix.push(answer);
        });
    }

    public modifier(questionJson: string) {
        super.modifier(questionJson);
        let values = JSON.parse(questionJson);
        this._answerChoix=[];
        values.reponses.forEach( reponse => {
            let answer = new ReponseCourte(reponse.reponse,reponse.descriptionReponse,reponse.descriptionMauvaiseReponse);
            this._answerChoix.push(answer);
        });
    }
    public corriger(tentative: Tentative): Pointage {
        let reponse = tentative.getReponse(this.getId());
        let isValid = false
        this._answerChoix.forEach((answerChoix: ReponseCourte) => {
            let bonneReponse = answerChoix.getReponse();
            if (reponse["reponse"] == bonneReponse) {
                isValid = true;                
            }
        });
        reponse["isValid"] = isValid;
        let pointage = new Pointage(isValid ? 1 : 0, 1);
        reponse["pointage"] = pointage;
        return pointage
    }
}