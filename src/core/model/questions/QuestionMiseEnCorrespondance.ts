import { ReponseMiseEnCorrespondance } from "../reponses/ReponseMiseEnCorrespondance";
import { Tentative } from "../Tentative";
import { Pointage } from "./Pointage";
import { Question } from "./Question";
export class QuestionMiseEnCorrespondance extends Question {

    //private isShuffled: boolean;
    private correspondances: [];
    constructor(questionJson: string) {
        super(questionJson)
        if (questionJson == undefined)
            return;
        let values = JSON.parse(questionJson)
        //this.isShuffled = values.isShuffled;
        this.correspondances = values.correspondances;
        JSON.parse(values.reponses).forEach(reponse => {
            let answer = new ReponseMiseEnCorrespondance(reponse.reponse, reponse.descriptionReponse, reponse.descriptionMauvaiseReponse, reponse.correspondance);
            this._answerChoix.push(answer);
        });
    }

    public modifier(questionJson: string) {
        super.modifier(questionJson);
        //this.isShuffled = values.isShuffled;
        let values = JSON.parse(questionJson);
        this._answerChoix = [];
        this.correspondances = values.correspondances;
        JSON.parse(values.reponses).forEach(reponse => {
            let answer = new ReponseMiseEnCorrespondance(reponse.reponse, reponse.descriptionReponse, reponse.descriptionMauvaiseReponse, reponse.correspondance);
            this._answerChoix.push(answer);
        });
    }

    public corriger(tentative: Tentative): Pointage {
        let reponse = tentative.getReponse(this.getId());
        let nbBonneReponse = 0;
        this._answerChoix.forEach((answerChoix: ReponseMiseEnCorrespondance) => {
            let correspondance = answerChoix.getCorrespondance();
            let option = answerChoix.getReponse();

            if (reponse[option] == correspondance) {
                reponse[option + "-isValid"] = true;
                nbBonneReponse++;
            }
            else {
                reponse[option + "-isValid"] = false;
            }
        });
        let pointage = new Pointage(nbBonneReponse, this._answerChoix.length);
        reponse["pointage"] = pointage;
        return pointage
    }
}