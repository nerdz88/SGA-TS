import { SGBService } from '../service/SGBService';
import { Universite } from '../service/Universite';

export class GestionnaireCours {
    private universite: Universite;


    constructor(universite: Universite) {
        this.universite = universite;
    }

    public async ajouterCours(element: string, token: string) {
        let cours = JSON.parse(element)
        let etudiants = await SGBService.recupererEtudiant("etudiant", cours._id, token);
        this.universite.ajouterCours(etudiants.data, cours._id, cours._groupe, cours._sigle,
            cours._titre, cours._nb_max_student,
            cours._date_debut, cours._date_fin, token);
    }

    recupererCours() {
        let cours = this.universite.recupererCours();
        if (cours == undefined || cours.length == 0) {
            return "[]";
        }
        return JSON.stringify(cours);
    }

    supprimerCours(sigle: string, idGroupe: number): boolean {
        return this.universite.supprimerCours(sigle, idGroupe)
    }


    public recupererGroupeCoursBySigle(sigle: string): string {
        return this.universite.recupererGroupeCoursParSigle(sigle);
    }

}