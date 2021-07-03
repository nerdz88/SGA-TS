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

    /*
        public recupererTousDevoirs(idEnseignant: number): string {
            let arrayEspaceCours = this.universite.recupererTousEspaceCours(idEnseignant)
            return JSON.stringify(arrayEspaceCours.flatMap(ec => {
                let devoirs = ec.recupererTousDevoirs();
                return devoirs.length > 0 ? devoirs : []
            }));
        }*/

    public recupererTousDevoirsEspaceCours(idEspaceCours: number): string {
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        return JSON.stringify(espaceCours.recupererTousDevoirs());
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

