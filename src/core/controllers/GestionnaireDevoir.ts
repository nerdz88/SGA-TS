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

    public recupererUnDevoir(idEspaceCours: number, IdDevoir: number, ordreTri: number) {
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        let devoir = espaceCours.recupererUnDevoir(IdDevoir)

        devoir.remises = devoir.remises.sort((a, b) => {
            switch (ordreTri) {
                case OrdreTriRemise.NomEtudiantAlphaCroissant: {
                    return a.etudiant.getNomComplet().localeCompare(b.etudiant.getNomComplet())
                }
                case OrdreTriRemise.NomEtudiantAlphaDecroissant: {
                    return b.etudiant.getNomComplet().localeCompare(a.etudiant.getNomComplet())
                }
                case OrdreTriRemise.NoteCroissant: {
                    return a.note - b.note
                }
                case OrdreTriRemise.NomEtudiantAlphaDecroissant: {
                    return b.note - a.note
                }
                default: {
                    return a.id - a.id
                }
            }
        })

        return JSON.stringify(devoir);
    }

    public supprimerDevoir(idEspaceCours: number, IdDevoir: number): boolean {
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        return espaceCours.suprimerDevoir(IdDevoir)
        //test
    }

}

enum OrdreTriRemise {
    Default,
    NomEtudiantAlphaCroissant,
    NomEtudiantAlphaDecroissant,
    NoteCroissant,
    NoteDecroissant
}