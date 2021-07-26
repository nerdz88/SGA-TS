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

    public recupererUnDevoirEtudiant(idEspaceCours: number, IdDevoir: number, idEtudiant: number) {
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        let devoir: any = espaceCours.recupererUnDevoir(IdDevoir);
        devoir._remiseEtudiant = devoir._remises.find(r => r._etudiant._id = idEtudiant);
        return JSON.stringify(devoir);
    }

    public supprimerDevoir(idEspaceCours: number, IdDevoir: number): boolean {
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        return espaceCours.suprimerDevoir(IdDevoir)
        //test
    }

    public remettreDevoir(idEspaceCours: number, idDevoir: number, idEtudiant: number, pathFichier: string) {
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        let devoir: any = espaceCours.recupererUnDevoir(idDevoir);
        devoir.remettreDevoir(idEtudiant, pathFichier);
    }

    public corrigerDevoir(idEspaceCours: number, idDevoir: number, idRemise: number, note: number, pathFichierCorrection: string, token: string, studentId : number) {
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        let devoir = espaceCours.recupererUnDevoir(idDevoir);
        devoir.corrigerDevoir(idRemise, note, pathFichierCorrection);
        this.ajouterNoteEtudiant(token, idEspaceCours, "devoir", idDevoir, note, studentId);
    }

    private async ajouterNoteEtudiant(token: string, idEspaceCours: number, type: string, type_id : number, note: number, studentId : number){
        return await this.universite.ajouterNoteEtudiant(token, idEspaceCours, type, type_id , note, studentId);
    }
}

