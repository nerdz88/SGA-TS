import { Devoir } from "../model/Devoir";
import { Remise } from "../model/Remise";
import { Universite } from "../service/Universite";

export class GestionnaireDevoir {

    private universite: Universite;

    constructor(universite: Universite) {
        this.universite = universite;
    }

    public ajouterDevoir(idEspaceCours: number, devoirJsonString: string) {
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        espaceCours.ajouterDevoir(devoirJsonString);
    }

    public modifierDevoir(idEspaceCours: number, IdDevoir: number, jsonString: string) {
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        espaceCours.modifierDevoir(IdDevoir, jsonString);
    }

    public recupererTousDevoirsEspaceCours(idEspaceCours: number): string {
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        return JSON.stringify(espaceCours.recupererTousDevoirs());
    }

    public recupererTousDevoirsEtudiant(idEtudiant: number, idEspaceCours: number): string {
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        let devoirsEspaceCours = espaceCours.recupererTousDevoirs();

        if (devoirsEspaceCours.length == 0) return "[]";

        let devoirsEtudiant = [];
        devoirsEspaceCours.forEach((d: any) => {
            if (!d._visible)
                return;
            d._remiseEtudiant = d._remises.find(r => r._etudiant._id = idEtudiant);     
            devoirsEtudiant.push(d);      
        });

        return JSON.stringify(devoirsEtudiant);
    }


    public recupererUnDevoir(idEspaceCours: number, IdDevoir: number, ordreTri: number = 0) {
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        let devoir = espaceCours.recupererUnDevoir(IdDevoir);
        devoir.remises = Remise.orderBy(devoir.remises, ordreTri);
        return JSON.stringify(devoir);
    }

    public supprimerDevoir(idEspaceCours: number, IdDevoir: number): boolean {
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        return espaceCours.suprimerDevoir(IdDevoir)
        //test
    }

}

