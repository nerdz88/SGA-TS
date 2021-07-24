import { Type } from 'class-transformer';
import { OrdreTri } from "./enum/OrdreTri";
import { Etudiant } from "./Etudiant";

export enum Etat {
    NonRemis = "Non Remis",
    Remis = "Remis",
    RemisCorrige = "Remis et Corrigé"
}

export class Remise {
    private _id: number;

    @Type(() => Etudiant)
    private _etudiant: Etudiant;
    private _dateRemise: Date;
    private _note: number;
    private _etat: Etat;
    private _dateDeCorrection: Date;
    private _pathFichier: string
    private _pathFichierCorrection: string
    static currentId: number = 0;

    constructor(etudiant: Etudiant) {
        this._id = ++Remise.currentId;
        this._etudiant = etudiant;
        this._etat = Etat.NonRemis;
    }

    public static orderBy(remises: Remise[], ordreTri: number): Remise[] {
        return remises.sort((a, b) => {
            switch (ordreTri) {
                case OrdreTri.NomEtudiantAlphaCroissant: {
                    return a.etudiant.getNomComplet().localeCompare(b.etudiant.getNomComplet())
                }
                case OrdreTri.NomEtudiantAlphaDecroissant: {
                    return b.etudiant.getNomComplet().localeCompare(a.etudiant.getNomComplet())
                }
                case OrdreTri.NoteCroissant: {
                    return a.note - b.note
                }
                case OrdreTri.NomEtudiantAlphaDecroissant: {
                    return b.note - a.note
                }
                default: {
                    return a.id - a.id
                }
            }
        });
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get etudiant(): Etudiant {
        return this._etudiant;
    }

    set etudiant(value: Etudiant) {
        this._etudiant = value;
    }

    get dateRemise(): Date {
        return this._dateRemise;
    }

    set dateRemise(value: Date) {
        this._dateRemise = value;
    }

    get note(): number {
        return this._note;
    }

    set note(value: number) {
        this._note = value;
    }

    get etat(): Etat {
        return this._etat;
    }

    set etat(value: Etat) {
        this._etat = value;
    }

    get dateDeCorrection(): Date {
        return this._dateDeCorrection;
    }

    set dateDeCorrection(value: Date) {
        this._dateDeCorrection = value;
    }


    get pathFichier(): string {
        return this._pathFichier;
    }

    set pathFichier(value: string) {
        this._pathFichier = value;
    }

    get pathFichierCorrection(): string {
        return this._pathFichierCorrection;
    }

    set pathFichierCorrection(value: string) {
        this._pathFichierCorrection = value;
    }
}
