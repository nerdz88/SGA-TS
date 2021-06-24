import { AlreadyExistsError } from "../errors/AlreadyExistsError";
import { NotFoundError } from "../errors/NotFoundError";
import { Cours } from "./Cours";
import { Etudiant } from "./Etudiant";
import { Question } from "./Question";
import { Questionnaire } from "./Questionnaire";
export class EspaceCours {
    // classe inspirée de la classe conceptuelle (du MDD)
    private _id: number;
    private _numero: string;
    private _enseignantId: number;
    private _etudiants: Etudiant[];
    private _questions: Question[];
    private _cours: Cours;
    private _dateDebut: string;// string pour l'instant, possibilité de Date
    private _dateFin: string; // string pour l'instant, possibilité de Date
    private _questionnaires : Questionnaire[];

    constructor(id: number, numero: string, dateDebut: string, dateFin: string, cours: Cours, _enseignantId: number) {
        this._id = id;
        this._numero = numero;
        this._cours = cours;
        this._dateDebut = dateDebut;
        this._dateFin = dateFin;
        this._etudiants = [];
        this._questions = [];
        this._questionnaires = [];
        this._enseignantId = _enseignantId;
    }

    ajouterEtudiants(etudiants: any) {
        etudiants.forEach((element) => {
            this._etudiants.push(new Etudiant(element._id, element._last_name, element._first_name, element._email, element._permanent_code));
        })
    }

    ajouterQuestionnaire(questionnaireJson : string){
        let newQuestionnaire =  new Questionnaire(questionnaireJson);
        this._questionnaires.push(newQuestionnaire);
    }

    public ajouterQuestion(questionJson: string) {
        let newQuestion = new Question(questionJson)
        if (this._questions.find(q => q.getNom() == newQuestion.getNom()))
            throw new AlreadyExistsError("la question " + newQuestion.getNom() + " existe déjà")
        this._questions.push(newQuestion);
    }

    public modifierQuestion(idQuestion: number, questionJson: string) {
        let q = this.recupererUneQuestion(idQuestion);
        q.modifier(questionJson);
    }

    public suprimerQuestion(idQuestion: number): boolean {
        let index = this._questions.findIndex(q => q.getId() == idQuestion);
        if (index != -1) {
            this._questions.splice(index, 1);
            return true;
        }
        return false
    }
    public recupererToutesQuestions(): Question[] {
        return this._questions;
    }
    public recupererUneQuestion(idQuestion: number): Question {
        let q = this._questions.find(c => c.getId() == idQuestion);
        if (q == undefined)
            throw new NotFoundError("La question " + idQuestion + " n'existe pas")
        return q;
    }

    public getID() {
        return this._id;
    }

    public getNumero() {
        return this._numero;
    }

    public getCours() {
        return this._cours;
    }

    public getEtudiants(): Etudiant[] {
        return this._etudiants;
    }


    public getIdEnseignant(): number {
        return this._enseignantId;
    }

    public getDateDebut() {
        return this._dateDebut;
    }
    public getDateFin() {
        return this._dateFin;
    }
}