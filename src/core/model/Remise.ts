import { Etudiant } from "./Etudiant";
import { Type } from 'class-transformer';

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
    private _cheminFichier: string
    static currentId: number = 0;

    constructor(etudiant: Etudiant) {
        this._id = ++Remise.currentId;
        this._etudiant = etudiant;
        this._etat = Etat.NonRemis;
    }

    public static orderBy(remises: Remise[], ordreTri: number): Remise[] {
        return remises.sort((a, b) => {
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

    
    get cheminFichier(): string {
        return this._cheminFichier;
    }

    set cheminFichier(value: string) {
        this._cheminFichier = value;
    }
}

export enum OrdreTriRemise {
    Default,
    NomEtudiantAlphaCroissant,
    NomEtudiantAlphaDecroissant,
    NoteCroissant,
    NoteDecroissant
}