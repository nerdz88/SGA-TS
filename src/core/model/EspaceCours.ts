import { AlreadyExistsError } from "../errors/AlreadyExistsError";
import { NotFoundError } from "../errors/NotFoundError";
import { Cours } from "./Cours";
import { Etudiant } from "./Etudiant";
import { Questionnaire } from "./Questionnaire";
import { Devoir } from "./Devoir";
import { InvalidParameterError } from "../errors/InvalidParameterError";
import { Type } from 'class-transformer';
import { Etat } from "./Remise";
import { HttpError } from "../errors/HttpError";
import { Question } from "./questions/Question";
import { TypeQuestion } from "./TypeQuestion";
import { QuestionChoixMultiple } from "./questions/QuestionChoixMultiple";
import { QuestionNumerique } from "./questions/QuestionNumerique";
import { QuestionReponseCourte } from "./questions/QuestionReponseCourte";
import { QuestionVraiFaux } from "./questions/QuestionVraiFaux";

export class EspaceCours {
    // classe inspirée de la classe conceptuelle (du MDD)
    private _id: number;
    private _numero: string;
    private _enseignantId: number;
    @Type(() => Etudiant)
    private _etudiants: Etudiant[];
    @Type(() => Question)
    private _questions: Question[];
    @Type(() => Devoir)
    private _devoirs: Devoir[];
    @Type(() => Cours)
    private _cours: Cours;
    private _dateDebut: string;// string pour l'instant, possibilité de Date
    private _dateFin: string; // string pour l'instant, possibilité de Date
    @Type(() => Questionnaire)
    private _questionnaires: Questionnaire[];

    constructor(id: number, numero: string, dateDebut: string, dateFin: string, cours: Cours, _enseignantId: number) {
        this._id = id;
        this._numero = numero;
        this._cours = cours;
        this._dateDebut = dateDebut;
        this._dateFin = dateFin;
        this._etudiants = [];
        this._questions = [];
        this._questionnaires = [];
        this._devoirs = [];
        this._enseignantId = _enseignantId;
    }

    //Reset pour les tests
    public static reset() {
        Devoir.currentId = 0;
        Question.currentId = 0;
        Questionnaire.currentId = 0;
    }

    public ajouterEtudiants(etudiants: any) {
        etudiants.forEach((element) => {
            this._etudiants.push(new Etudiant(element._id, element._last_name, element._first_name, element._email, element._permanent_code));
        })
    }

    public ajouterQuestionnaire(questionnaireJson: string) {
        let newQuestionnaire = new Questionnaire(questionnaireJson, this._etudiants);
        this._questionnaires.push(newQuestionnaire);
        return newQuestionnaire.getId();
    }

    public modifierQuestionnaire(idQuestionnaire: number, questionnaireJson) {
        let q = this.recupererUnQuestionnaire(idQuestionnaire);
        q.modifier(questionnaireJson);
    }

    private creerQuestion(type : number,jsonString : string) :Question{
        switch(type){
            case TypeQuestion["question-vrai-faux"]:
                return new QuestionVraiFaux(jsonString);
            case TypeQuestion["question-choix-multiples"]:
                return new QuestionChoixMultiple(jsonString);
            case TypeQuestion["question-mise-correspondance"]:
                //return new QuestionmiseEnCorrespondance
            break;
            case TypeQuestion["question-numerique"]:
                return new QuestionNumerique(jsonString);
            case TypeQuestion["question-reponse-courte"]:
                return new QuestionReponseCourte(jsonString);
        }
        return null;
    }

    public ajouterQuestion(questionJson: string, type : number) {
        //let newQuestion = new Question(questionJson)
        let newQuestion = this.creerQuestion(type,questionJson);
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

    public ajouterDevoir(devoirJson: string) {
        //TODO
        let newDevoir = new Devoir(devoirJson, this._etudiants);
        // La date de début est après la date de fin, on retourne une erreur
        if (newDevoir.dateDebut > newDevoir.dateFin) {
            throw new InvalidParameterError("le devoirs " + newDevoir.nom + " ne dois pas avoir une date de debut qui est après la date de fin")
        }
        this._devoirs.push(newDevoir);
    }

    public modifierDevoir(idDevoir: number, jsonString: string) {
        let devoir = this.recupererUnDevoir(idDevoir);
        if (devoir.remises.find(r => r.etat != Etat.NonRemis) != undefined)
            throw new HttpError("Impossible de modifier un devoir, ayant déjà une remise d'un étudiant")
        devoir.modifier(jsonString);
    }

    public recupererTousDevoirs(): Devoir[] {
        return this._devoirs;
    }

    public recupererUnDevoir(idDevoir: number): Devoir {
        let devoir = this._devoirs.find(d => d.id == idDevoir);
        if (devoir == undefined)
            throw new NotFoundError("Le Devoir " + idDevoir + " n'existe pas")
        return devoir;
    }

    public suprimerDevoir(idDevoir: number) {
        let devoir = this.recupererUnDevoir(idDevoir);
        
        if (devoir.remises.find(r => r.etat != Etat.NonRemis) != undefined)
            throw new HttpError("Impossible de supprimer un devoir, ayant déjà une remise d'un étudiant")

        let index = this._devoirs.findIndex(d => d.id == idDevoir);
        if (index != -1) {
            this._devoirs.splice(index, 1);
            return true;
        }
        return false;
    }

    public recupererTagQuestions(): string[] {
        return this.recupererToutesQuestions().flatMap(q => {
            let tags = q.getTag();
            return tags.length > 0 ? tags : [];
        }).filter((tag, index, list) => list.indexOf(tag) === index);
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

    public hasEtudiantById(idEtudiant: number): boolean {
        return this._etudiants.find(e => e.getId() == idEtudiant) != undefined;
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

    public recupererToutQuestionnaires(): Questionnaire[] {
        return this._questionnaires;
    }

    public recupererUnQuestionnaire(idQuestionnaire: number): Questionnaire {
        return this._questionnaires.find(c => c.getId() == idQuestionnaire);
    }

    public suprimerQuestionnaire(idQuestionnaire: number): boolean {
        let index = this._questionnaires.findIndex(q => q.getId() == idQuestionnaire);
        if (index != -1) {
            let questions = this._questionnaires[index].getQuestions()
            this._questionnaires.splice(index, 1);
            if (questions.length != 0)
                questions.forEach(question => {
                    question.setNbOccurence(question.getNbOccurence() - 1)
                });
            return true;
        }
        return false;
    }
}