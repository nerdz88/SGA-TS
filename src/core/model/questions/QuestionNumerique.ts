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
        values.reponses.forEach(reponse => {
            let answer = new ReponseNumerique(reponse.reponse, reponse.descriptionReponse, reponse.descriptionMauvaiseReponse);
            this._answerChoix.push(answer);
        });
    }

    public modifier(questionJson: string) {
        super.modifier(questionJson);
        let values = JSON.parse(questionJson);
        this._answerChoix = [];
        values.reponses.forEach(reponse => {
            let answer = new ReponseNumerique(reponse.reponse, reponse.descriptionReponse, reponse.descriptionMauvaiseReponse);
            this._answerChoix.push(answer);
        });
    }

    public corriger(tentative: Tentative): Pointage {
        let reponse = tentative.getReponse(this.getId());
        let isValid = false
        this._answerChoix.forEach((answerChoix: ReponseNumerique) => {
            let bonneReponse = answerChoix.getReponse();
            if (parseInt(reponse["reponse"]) == parseInt(bonneReponse)) {
                isValid = true;
            }
        });
        reponse["isValid"] = isValid;
        let pointage = new Pointage(isValid ? 1 : 0, 1);
        reponse["pointage"] = pointage;
        return pointage
    }

}