import { Type } from 'class-transformer';
import { AlreadyExistsError } from "../errors/AlreadyExistsError";
import { NotFoundError } from "../errors/NotFoundError";
import { Cours } from "../model/Cours";
import { Devoir } from '../model/Devoir';
import { EspaceCours } from "../model/EspaceCours";
import { Questionnaire } from '../model/Questionnaire';
import { Question } from '../model/questions/Question';
import { SGBService } from "./SGBService";

export class Universite {
    @Type(() => EspaceCours)
    private arrayEspaceCours: EspaceCours[]
    @Type(() => Cours)
    private arrayCours: Cours[]
    constructor() {
        this.arrayEspaceCours = new Array();
        this.arrayCours = new Array();
    }

    //Reset pour les tests
    public reset() {
        this.arrayEspaceCours = new Array();
        this.arrayCours = new Array();
        EspaceCours.reset();
    }

    public setUniversite(universite: Universite) {
        this.arrayCours = universite.arrayCours;
        this.arrayEspaceCours = universite.arrayEspaceCours;
        Question.currentId = this.arrayEspaceCours.map(ec => ec.recupererToutesQuestions().length).reduce((sum, current) => sum + current, 0);
        Questionnaire.currentId = this.arrayEspaceCours.map(ec => ec.recupererToutQuestionnaires().length).reduce((sum, current) => sum + current, 0);
        Devoir.currentId = this.arrayEspaceCours.map(ec => ec.recupererTousDevoirs().length).reduce((sum, current) => sum + current, 0);
    }


    public async ajouterEspaceCours(coursSGB: any, token: string, idEnseignant: number) {
        if (this.getIndexEspaceCoursById(coursSGB._id) != -1) {
            throw new AlreadyExistsError(coursSGB._titre + " ,gr: " + coursSGB._id + " a déjà été choisi par un autre enseignant");
        }

        let cours = this.getCoursBySigle(coursSGB._sigle);
        if (cours == undefined) {
            this.arrayCours.push(new Cours(coursSGB._sigle, coursSGB._titre, coursSGB._nb_max_student));
            cours = this.getCoursBySigle(coursSGB._sigle);
        }

        let etudiants = await SGBService.recupererEtudiant(token, coursSGB._id);

        let espaceCours = new EspaceCours(coursSGB._id,
            coursSGB._groupe,
            coursSGB._date_debut,
            coursSGB._date_fin,
            cours, idEnseignant);
        espaceCours.ajouterEtudiants(etudiants);
        this.arrayEspaceCours.push(espaceCours);
    }


    public recupererUnEspaceCours(id: number): EspaceCours {
        let index = this.getIndexEspaceCoursById(id);
        if (index == -1)
            throw new NotFoundError("L'espace cours " + id + " n'existe pas.");
        return this.arrayEspaceCours[index];
    }

    public recupererTousEspaceCours(idEnseignant: number): EspaceCours[] {
        //TODO filtrer selon le token
        let arrayEspaceCoursDeEnseignant = [];
        this.arrayEspaceCours.forEach(element => {
            if (element.getIdEnseignant() == idEnseignant) {
                arrayEspaceCoursDeEnseignant.push(element);
            }
        });
        return arrayEspaceCoursDeEnseignant;
    }

    public recupererTousEspaceCoursEtudiant(idEtudiant: number): EspaceCours[] {
        return this.arrayEspaceCours.filter(e => e.hasEtudiantById(idEtudiant));
    }

    public supprimerEspaceCours(id: number): boolean {
        let index = this.getIndexEspaceCoursById(id);
        if (index == -1) {
            return false;
        }
        this.arrayEspaceCours.splice(index, 1);
        return true;
    }

    public espaceCoursExist(id: number): boolean {
        return this.getIndexEspaceCoursById(id) != -1;
    }

    private getCoursBySigle(sigle: string) {
        return this.arrayCours.find(c => c.getSigle() == sigle);
    }

    private getIndexEspaceCoursById(id: number) {
        return this.arrayEspaceCours.findIndex(c => c.getID() == id);
    }

}