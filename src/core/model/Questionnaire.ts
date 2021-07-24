import { Type } from 'class-transformer';
import { NotFoundError } from '../errors/NotFoundError';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { Etudiant } from "./Etudiant";
import { Question } from "./questions/Question";
import { Tentative } from "./Tentative";

export class Questionnaire {
    private _id: number;
    static currentId: number = 0;
    private _idEspaceCours: number
    private _description: string;
    private _nom: string;
    private _status: boolean
    @Type(() => Question)
    private _questions: Question[]
    @Type(() => Tentative)
    private _tentatives: Tentative[]

    constructor(questionnaireJson: string, etudiants: Etudiant[]) {
        if (questionnaireJson == undefined)
            return;

        let values = JSON.parse(questionnaireJson);
        this._idEspaceCours = values.idEspaceCours;
        this._nom = values.nom;
        this._description = values.description;
        this._status = values.status;
        this._questions = [];
        this._tentatives = this.initTentative(etudiants);
        this._id = ++Questionnaire.currentId;
    }

    public modifier(questionJson: string) {
        let values = JSON.parse(questionJson);
        this._nom = values.nom;
        this._description = values.description;
        this._status = values.status;
    }

    private initTentative(etudiants: Etudiant[]): Tentative[] {
        var lstTentative = [];
        etudiants.forEach(etudiant => lstTentative.push(new Tentative(etudiant)));
        return lstTentative;
    }

    public getQuestionById(idQuestion: number): Question {
        let question = this.getQuestions().find(q => q.getId() == idQuestion);
        if (question == undefined)
            throw new NotFoundError(`La question [${idQuestion}] n'existe pas dans le questionnaire [${this._id}]`);
        return question;
    }

    public getTentativeEtudiant(idEtudiant: number): Tentative {
        let tentative = this.getTentative().find(t => t.etudiant.getId() == idEtudiant);
        if (tentative == undefined)
            throw new UnauthorizedError(`L'étudiant [${idEtudiant}] n'est pas dans le questionnaire [${this._id}]`);
        return tentative
    }

    public repondreQuestion(idQuestion : number, idEtudiant : number, reponseJSON: string) {
        let reponse = JSON.parse(reponseJSON);      
        let tentative = this.getTentativeEtudiant(idEtudiant);
        tentative.repondre(idQuestion, reponse);        
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
    public getTentative(): Tentative[] {
        return this._tentatives;
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

    public setTentative(arrayRemise: Tentative[]) {
        this._tentatives = arrayRemise;
    }

    public ajouterQuestion(question: Question) {
        return this._questions.push(question)
    }
}