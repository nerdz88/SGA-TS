import { ReponseChoixMultiple } from "../reponses/ReponseChoixMultiple";
import { Tentative } from "../Tentative";
import { Pointage } from "./Pointage";
import { Question } from "./Question";

export class QuestionChoixMultiple extends Question {
    constructor(questionJson: string) {
        super(questionJson)
        if (questionJson == undefined)
            return;
        let values = JSON.parse(questionJson)
        JSON.parse(values.reponses).forEach(reponse => {
            let answer = new ReponseChoixMultiple(reponse.reponse,/*reponse.ponderation,*/reponse.descriptionReponse, reponse.descriptionMauvaiseReponse, reponse.choix);
            this._answerChoix.push(answer);
        });
    }

    public modifier(questionJson: string) {
        super.modifier(questionJson);
        let values = JSON.parse(questionJson)
        this._answerChoix = [];
        JSON.parse(values.reponses).forEach(reponse => {
            let answer = new ReponseChoixMultiple(reponse.reponse,/*reponse.ponderation,*/reponse.descriptionReponse, reponse.descriptionMauvaiseReponse, reponse.choix);
            this._answerChoix.push(answer);
        });
    }

    public corriger(tentative: Tentative): Pointage {

        let reponse = tentative.getReponse(this.getId());
        let nbBonChoix = 0;
        this._answerChoix.forEach((choix: ReponseChoixMultiple) => {
            if (reponse[choix.getChoix()] && choix.getReponse()) {
                reponse[choix.getChoix() + "-isValid"] = true;
                nbBonChoix++;
            }
            else {
                reponse[choix.getChoix() + "-isValid"] = false;
            }

        });
        let pointage = new Pointage(nbBonChoix, this._answerChoix.length);
        reponse["pointage"] = pointage;

        return pointage
    }
}