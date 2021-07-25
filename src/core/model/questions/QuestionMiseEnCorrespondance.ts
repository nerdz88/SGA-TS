import { ReponseMiseEnCorrespondance } from "../reponses/ReponseMiseEnCorrespondance";
import { Tentative } from "../Tentative";
import { Pointage } from "./Pointage";
import { Question } from "./Question";
export class QuestionMiseEnCorrespondance extends Question {

    //private isShuffled: boolean;
    private correspondances:[];
    constructor(questionJson: string) {
        super(questionJson)
        if (questionJson == undefined)
            return;
        let values = JSON.parse(questionJson)
        //this.isShuffled = values.isShuffled;
        this.correspondances=values.correspondances;
        JSON.parse(values.reponses).forEach( reponse => {
            let answer = new ReponseMiseEnCorrespondance(reponse.reponse,reponse.descriptionReponse,reponse.descriptionMauvaiseReponse,reponse.correspondance);
            this._answerChoix.push(answer);
        });
    }

    public modifier(questionJson: string) {
        super.modifier(questionJson);
        //this.isShuffled = values.isShuffled;
        let values = JSON.parse(questionJson);
        this._answerChoix=[];
        this.correspondances=values.correspondances;
        JSON.parse(values.reponses).forEach( reponse => {
            let answer = new ReponseMiseEnCorrespondance(reponse.reponse,reponse.descriptionReponse,reponse.descriptionMauvaiseReponse,reponse.correspondance);
            this._answerChoix.push(answer);
        });
    }

    public corriger(tentative: Tentative): Pointage {    
        return new Pointage(0, 0);
    }
}