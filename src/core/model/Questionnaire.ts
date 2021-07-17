import { Remise } from "./Remise";
import { Type } from 'class-transformer';
import { Etudiant } from "./Etudiant";
import { Question } from "./questions/Question";

export class Questionnaire {
    private _id: number;
    static currentId: number = 0;
    private _idEspaceCours: number
    private _description: string;
    private _nom: string;
    private _status: boolean
    @Type(() => Question)
    private _questions: Question[]
    @Type(() => Remise)
    private _remises: Remise[]

    constructor(questionnaireJson: string, etudiants: Etudiant[]) {
        if (questionnaireJson == undefined)
            return;

        let values = JSON.parse(questionnaireJson);
        this._idEspaceCours = values.idEspaceCours;
        this._nom = values.nom;
        this._description = values.description;
        this._status = values.status;
        this._questions = [];
        this._remises = this.initRemises(etudiants);
        this._id = ++Questionnaire.currentId;
    }

    public modifier(questionJson: string) {
        let values = JSON.parse(questionJson);
        this._nom = values.nom;
        this._description = values.description;
        this._status = values.status;
    }

    private initRemises(etudiants: Etudiant[]): Remise[] {
        var listRemise = [];
        etudiants.forEach(etudiant => listRemise.push(new Remise(etudiant)));
        return listRemise;
    }

    public getId() {
        return this._id;
    }
    public getIdEspaceCours() {
        return this._idEspaceCours;
    }
    public getNom() {
        return this._nom;
    }
    public getDescription() {
        return this._description;
    }
    public getRemise(): Remise[] {
        return this._remises;
    }
    public getStatus() {
        return this._status;
    }
    public getQuestions(): Question[] {
        return this._questions;
    }

    public setQuestion(arrayQuestion: []) {
        this._questions = arrayQuestion;
    }

    public setRemise(arrayRemise: Remise[]) {
        this._remises = arrayRemise;
    }

    public ajouterQuestion(question: Question) {
        return this._questions.push(question)
    }
}