import { Etudiant } from "./Etudiant";
import { Type } from 'class-transformer';
import { OrdreTri } from "./enum/OrdreTri";
import { HttpError } from "../errors/HttpError";

export enum EtatTentative {
    NonComplete = "Non complété",
    EnCours = "En cours",
    Complete = "Complété"
}

export class Tentative {
    private _id: number;

    @Type(() => Etudiant)
    private _etudiant: Etudiant;
    private _dateDebut: Date;
    private _dateFin: Date;
    private _note: number;
    private _etat: EtatTentative;
    private _mapReponse: {};
    static currentId: number = 0;

    constructor(etudiant: Etudiant) {
        this._id = ++Tentative.currentId;
        this._etudiant = etudiant;
        this._etat = EtatTentative.NonComplete;
        this._mapReponse = {};
    }

    public static orderBy(tentative: Tentative[], ordreTri: number): Tentative[] {
        return tentative.sort((a, b) => {
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

    public repondre(idQuestion: number, reponse : any) {
        this._mapReponse[idQuestion] = reponse;
    }

    public getReponse(idQuestion: number): any {
        return this._mapReponse[idQuestion];
    }

    public commencerTentative() {
        if(this._etat == EtatTentative.NonComplete)
        {
            this._dateDebut = new Date();
            this._etat = EtatTentative.EnCours
        }
        else 
            throw new HttpError("Impossible de commencer une tentative terminée ou en cours", 400);
    }

    public finirTentative() {
        if(this._etat == EtatTentative.EnCours)
        {
            this._dateFin = new Date();
            this._etat = EtatTentative.Complete;
        }
        else 
            throw new HttpError("Impossible de terminer une tentative terminé ou non complétée", 400);
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

    get dateDebut(): Date {
        return this._dateDebut;
    }

    set dateDebut(value: Date) {
        this._dateDebut = value;
    }

    get dateFin(): Date {
        return this._dateFin;
    }

    set dateFin(value: Date) {
        this._dateFin = value;
    }

    get note(): number {
        return this._note;
    }

    set note(value: number) {
        this._note = value;
    }

    get etat(): EtatTentative {
        return this._etat;
    }

    set etat(value: EtatTentative) {
        this._etat = value;
    }
}

