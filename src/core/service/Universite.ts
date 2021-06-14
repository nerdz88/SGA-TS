import { Cours } from "../model/Cours"
import { GroupeCours } from "../model/GroupeCours";
import { Question } from "../model/Question"

export class Universite {

    //private arrayQuestion: Question[] 
    private arrayCours : Cours[] 

    constructor(){
        this.arrayCours = new Array();
    }

    public ajouterCours( etudiants:any,idGroupeCours: number, numeroGroupe : string,sigle: string, titre: string, nbMaxEtudiant: number, dateDebut: string, dateFin: string, token?: string){
        let index = this.getIndexCoursBySigle(sigle);
        if (index != -1) {
            let groupe = new GroupeCours(idGroupeCours, numeroGroupe, dateDebut, dateFin);
            groupe.ajouterEtudiants(etudiants);
            this.arrayCours[index].ajoutGroupeCours(groupe);
        } else if (sigle != null) {
            let cours = new Cours(sigle, titre, nbMaxEtudiant);
            let groupe = new GroupeCours(idGroupeCours, numeroGroupe, dateDebut, dateFin);
            groupe.ajouterEtudiants(etudiants);
            cours.ajoutGroupeCours(groupe);
            this.arrayCours.push(cours);
        }
    }

    public supprimerCours(sigle: string, idGroupe: number): boolean {
        let indexCours = this.getIndexCoursBySigle(sigle);
        if (indexCours == -1)
            return false;
        let cours = this.arrayCours[indexCours];
        if (cours.getTailleCours() == 1 && cours.getGroupeCours()[0].getID() == idGroupe)
            this.arrayCours.splice(indexCours, 1);
        else {
            let indexGroupe = cours.getGroupeCours().findIndex(g => g.getID() == idGroupe);
            if (indexGroupe == -1)
                return false;
            cours.getGroupeCours().splice(indexGroupe, 1);
        }
    }

    private getIndexCoursBySigle(sigle : string){
        let index = this.arrayCours.findIndex(c => c.getSigle() == sigle);
        return index;
    }

    public recupererCours(){
        return this.arrayCours;
    }
}