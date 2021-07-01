import { Question } from "./Question";
import { Remise } from "./Remise";
import { Type } from 'class-transformer';

export class Questionnaire {
    private _id: number;
    static currentId: number = 0;
    private _description : string;
    private _nom : string;
    private _status: boolean
    @Type(() => Question)
    private _questions : Question[]
    @Type(() => Remise)
    private _remiseArray : Remise[]
    
    constructor(questionnaireJson: string) {
        if(questionnaireJson == undefined)
            return;

        let values = JSON.parse(questionnaireJson ?? "{}");
        this._nom = values.nom;
        this._description = values.description;
        this._status = values.status;
        this._questions = [];
        this._remiseArray =[];
        this._id = ++Question.currentId;
    }



    public modifier(questionJson: string) {
        let values = JSON.parse(questionJson);
        this._nom = values.nom;
        this._description = values.description;
        this._status = values.status;
    }
    public getId() {
        return this._id;
    }
    public getNom() {
        return this._nom;
    }
    public getDescription() {
        return this._description;
    }
    public getRemise() {
        return this._remiseArray;
    }
    public getStatus() {
        return this._status;
    }
    public getQuestions(){
        return this._questions;
    }

    public setQuestion(arrayQuestion : []){
        this._questions=arrayQuestion;
    }

    public setRemise(arrayRemise : []){
        this._remiseArray = arrayRemise;
    }
}