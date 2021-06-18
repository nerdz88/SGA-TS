import { AlreadyExistsError } from "../errors/AlreadyExistsError";
import { NotFoundError } from "../errors/NotFoundError";
import { Cours } from "../model/Cours"
import { EspaceCours } from "../model/EspaceCours";
import { Question } from "../model/Question"
import { SGBService } from "./SGBService";

export class Universite {

    //private arrayQuestion: Question[] 
    private arrayEspaceCours: EspaceCours[]
    private arrayCours: Cours[]

    constructor() {
        this.arrayEspaceCours = new Array();
        this.arrayCours = new Array();
    }

    // this.universite.ajouterCours(etudiants.data, cours._id, cours._groupe, cours._sigle,
    //     cours._titre, cours._nb_max_student,
    //     cours._date_debut, cours._date_fin, token);

    public async ajouterEspaceCours(coursSGB: any, token: string) {
        if (this.getIndexEspaceCoursById(coursSGB._id) != -1) {
            throw new NotFoundError("L'espace cours " + coursSGB._id + " existe déjà");
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
            cours);
        espaceCours.ajouterEtudiants(etudiants);
        this.arrayEspaceCours.push(espaceCours);
    }



    // public ajouterCours(etudiants: any, idGroupeCours: number, numeroGroupe: string, sigle: string, titre: string, nbMaxEtudiant: number, dateDebut: string, dateFin: string, token?: string) {
    //     let index = this.getIndexCoursBySigle(sigle);
    //     if (index != -1) {
    //         let groupe = new EspaceCours(idGroupeCours, numeroGroupe, dateDebut, dateFin);
    //         groupe.ajouterEtudiants(etudiants);
    //         this.arrayEspaceCours[index].ajoutGroupeCours(groupe);
    //     } else if (sigle != null) {
    //         let cours = new Cours(sigle, titre, nbMaxEtudiant);
    //         let groupe = new EspaceCours(idGroupeCours, numeroGroupe, dateDebut, dateFin);
    //         groupe.ajouterEtudiants(etudiants);
    //         cours.ajoutGroupeCours(groupe);
    //         this.arrayEspaceCours.push(cours);
    //     }
    // }

    public recupererUnEspaceCours(id: number): EspaceCours {
        let index = this.getIndexEspaceCoursById(id);
        if (index == -1)
            throw new NotFoundError("L'espace cours " + id + " n'existe pas.");
        return this.arrayEspaceCours[index];
    }

    public recupererTousEspaceCours(token: string): EspaceCours[] {
        //TODO filtrer selon le token
        return this.arrayEspaceCours;
    }


    public supprimerEspaceCours(id: number): boolean {
        let index = this.getIndexEspaceCoursById(id);
        if (index == -1) {
            return false;
        }
        this.arrayEspaceCours.splice(index, 1);
        return true;
    }

    // public supprimerCours(sigle: string, idGroupe: number): boolean {
    //     let indexCours = this.getIndexCoursBySigle(sigle);
    //     if (indexCours == -1) {
    //         return false;
    //     }
    //     let cours = this.arrayEspaceCours[indexCours];
    //     if (cours.getTailleCours() == 1 && cours.getGroupeCours()[0].getID() == idGroupe) {
    //         this.arrayEspaceCours.splice(indexCours, 1);
    //     } else {
    //         let indexGroupe = cours.getGroupeCours().findIndex(g => g.getID() == idGroupe);
    //         if (indexGroupe == -1) {
    //             return false;
    //         }
    //         cours.getGroupeCours().splice(indexGroupe, 1);
    //     }
    //     return true;
    // }

    /*private getIndexCoursBySigle(sigle: string) {
        return this.arrayCours.findIndex(c => c.getSigle() == sigle);
    }*/
    private getCoursBySigle(sigle: string) {
        return this.arrayCours.find(c => c.getSigle() == sigle);
    }

    private getIndexEspaceCoursById(id: number) {
        return this.arrayEspaceCours.findIndex(c => c.getID() == id);
    }

    /*public recupererTousEspaceCours() {
        return this.arrayEspaceCours;
    }*/
}