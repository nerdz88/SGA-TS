import * as AdmZip from 'adm-zip';
import * as fs from 'fs';
import { InvalidParameterError } from "../errors/InvalidParameterError";
import { Etat } from "../model/enum/Etat";
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
            if (d._visible) {
                d._remiseEtudiant = d._remises.find(r => r._etudiant._id == idEtudiant);
                devoirsEtudiant.push(d);
            }
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
        devoir._remiseEtudiant = devoir._remises.find(r => r._etudiant._id == idEtudiant);
        return JSON.stringify(devoir);
    }

    public supprimerDevoir(idEspaceCours: number, IdDevoir: number): boolean {
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        return espaceCours.suprimerDevoir(IdDevoir)
        //test
    }

    public remettreDevoir(idEspaceCours: number, idDevoir: number, idEtudiant: number, pathFichier: string) {
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        let devoir = espaceCours.recupererUnDevoir(idDevoir);
        devoir.remettreDevoir(idEtudiant, pathFichier);
    }

    public async corrigerDevoir(idEspaceCours: number, idDevoir: number, idRemise: number, note: number, pathFichierCorrection: string, token: string) {
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        let devoir = espaceCours.recupererUnDevoir(idDevoir);
        let studentId = devoir.getRemiseById(idRemise).etudiant.getId();
        devoir.corrigerDevoir(idRemise, note, pathFichierCorrection);
        return await this.ajouterNoteEtudiant(token, idEspaceCours, "devoir", idDevoir, note, studentId);
    }

    private async ajouterNoteEtudiant(token: string, idEspaceCours: number, type: string, type_id: number, note: number, studentId: number) {
        return await this.universite.ajouterNoteEtudiant(token, idEspaceCours, type, type_id, note, studentId);
    }

    public creerZipCorrectionDevoir(idEspaceCours: number, idDevoir: number): string {
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        let devoir = espaceCours.recupererUnDevoir(idDevoir);

        const zipper = new AdmZip();
        let contentBufferCSV: string[] = [];
        contentBufferCSV.push("ID; Code permanent; Nom complet; Nom du fichier de retroaction; Note");
        devoir.remises.forEach((remise: Remise) => {
            if (remise.etat != Etat.Remis)
                return;
            let path = remise.pathFichier;
            let filaname = path.split("/").pop().replace("devoir-", "devoir-retroaction-");

            zipper.addFile(filaname,
                fs.readFileSync(path)
            );

            let contentRowCSV: string[] = [
                remise.id.toString(),
                remise.etudiant.getCodePermanent(),
                remise.etudiant.getNomComplet(),
                filaname
            ];
            contentBufferCSV.push(contentRowCSV.join(";"));
        });
        zipper.addFile(`correction-devoir-${idDevoir}.csv`, contentBufferCSV.join("\r\n"));
        let zipPath = `uploads/devoirs/${idEspaceCours}/${idDevoir}`;
        fs.mkdirSync(zipPath, { recursive: true });
        let nomFichier = `/correction-devoir-${idDevoir}-${new Date().getTime()}.zip`;
        zipper.writeZip(zipPath + nomFichier);
        return zipPath + nomFichier;
    }

    public async corrigerTousDevoirsZip(idEspaceCours: number, idDevoir: number, pathFichierZip: string, tokenEnseignant: string) {
        const zipper = new AdmZip(pathFichierZip);
        let fichierCSV = zipper.getEntries().find(f => f.entryName.toLowerCase().endsWith(".csv"))
        if (fichierCSV == undefined)
            throw new InvalidParameterError("Erreur pour la correction du devoir en Mode Multiple - le ZIP doit contenir un fichier .CSV")
        let pathContenuZip = `./uploads/devoirs/${idEspaceCours}/${idDevoir}/retroaction`
        zipper.extractAllTo(pathContenuZip, true);

        let data = fs.readFileSync(`${pathContenuZip}/${fichierCSV.entryName}`);
        let contenuFichierCSV: string[] = data.toString().replace(/\r\n/g, '\n').split('\n');
        let noteError = false;
        contenuFichierCSV.forEach(async (line, index) => {
            //On skip le header
            if (index == 0 || line == "" || noteError)
                return;

            let lineCorrectionCSV = line.split(";");
            let idRemise = lineCorrectionCSV[0];
            let nomFichierRetro = lineCorrectionCSV[3];
            let note = parseInt(lineCorrectionCSV[4]);

            if (!Number.isInteger(note) || note < 0) {
                noteError = true;
                return;
            }

            let pathfichierRetro = `${pathContenuZip}/${nomFichierRetro}`;
            let hasRetro = fs.existsSync(pathfichierRetro);
            await this.corrigerDevoir(idEspaceCours, idDevoir,
                parseInt(idRemise),
                note,
                hasRetro ? pathfichierRetro : "",
                tokenEnseignant);
        });

        if (noteError)
            throw new InvalidParameterError("Erreur pour la correction du devoir en Mode Multiple - le fichier CSV contient" +
                " une note invalide, la note doit être un nombre plus grand que 0");
    }


}

