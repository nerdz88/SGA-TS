import { EspaceCours } from '../model/EspaceCours';
import { SGBService } from '../service/SGBService';
import { Universite } from '../service/Universite';

export class GestionnaireCours {
    private universite: Universite;

    constructor(universite: Universite) {
        this.universite = universite;
    }

    public async ajouterEspaceCours(element: string, token: string) {
        let cours = JSON.parse(element)
        await this.universite.ajouterEspaceCours(cours, token);
        // let etudiants = await SGBService.recupererEtudiant("etudiant", cours._id, token);
        // this.universite.ajouterCours(etudiants.data, cours._id, cours._groupe, cours._sigle,
        //     cours._titre, cours._nb_max_student,
        //     cours._date_debut, cours._date_fin, token);
    }

    public recupererTousEspaceCours(token: string): string {
        return JSON.stringify(this.universite.recupererTousEspaceCours(token));
        /*let cours = this.universite.recupererCours();
        if (cours == undefined || cours.length == 0) {
            return "[]";
        }
        return JSON.stringify(cours);*/
    }

    public recupererUnEspaceCours(id: number) {
        return JSON.stringify(this.universite.recupererUnEspaceCours(id));
    }

    public supprimerEspaceCours(id: number): boolean {
        return this.universite.supprimerEspaceCours(id)
    }

    // public recupererGroupeCoursBySigle(sigle: string): string {
    //     return this.universite.recupererGroupeCoursParSigle(sigle);
    // }

}