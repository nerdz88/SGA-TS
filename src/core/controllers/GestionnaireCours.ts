import { SGBService } from '../service/SGBService';
import { Universite } from '../service/Universite';

export class GestionnaireCours {

    private universite: Universite;

    constructor(universite: Universite) {
        this.universite = universite;
    }

    public async ajouterEspaceCours(element: string, token: string, idEnseignant: number) {
        let cours = JSON.parse(element)
        return await this.universite.ajouterEspaceCours(cours, token, idEnseignant);
    }

    public recupererTousEspaceCours(idEnseignant: number): string {
        return JSON.stringify(this.universite.recupererTousEspaceCours(idEnseignant));
    }

    public recupererTousEspaceCoursEtudiant(idEtudiant: number): string {
        return JSON.stringify(this.universite.recupererTousEspaceCoursEtudiant(idEtudiant));
    }

    public recupererUnEspaceCours(id: number) {
        return JSON.stringify(this.universite.recupererUnEspaceCours(id));
    }

    public supprimerEspaceCours(id: number): boolean {
        return this.universite.supprimerEspaceCours(id)
    }

    public async recupererGroupesCours(token: string) {
        let groupesCours = await SGBService.recupererGroupesCours(token);
        groupesCours.forEach((gc: any) => {
            gc._disponible = !this.universite.espaceCoursExist(gc._id);
        });
        return groupesCours;
    }

}