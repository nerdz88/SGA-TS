import { Etudiant } from "./Etudiant";
import { Type } from 'class-transformer';
import { OrdreTri } from "./enum/OrdreTri";
import { HttpError } from "../errors/HttpError";
import { Pointage } from "./questions/Pointage";
import { EtatTentative } from "./enum/EtatTentative";



export class Tentative {
    private _id: number;

    @Type(() => Etudiant)
    private _etudiant: Etudiant;
    private _dateDebut: Date;
    private _dateFin: Date;
    private _pointage: Pointage;
    private _etat: EtatTentative;
    private _mapReponse: {};
    static currentId: number = 0;

    constructor(etudiant: Etudiant) {
        this._id = ++Tentative.currentId;
        this._etudiant = etudiant;
        this._etat = EtatTentative.NonComplete;
        this._mapReponse = {};
        this._pointage = new Pointage(0, 0);
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
                    return a._pointage.point - b._pointage.point
                }
                case OrdreTri.NoteDecroissant: {
                    return b._pointage.point - a._pointage.point
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

    public augementerPointage(pointage: Pointage) {
        this.pointage.point += pointage.point;
        this.pointage.pointMax += pointage.pointMax;
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

    get pointage(): Pointage {
        return this._pointage;
    }

    set pointage(value: Pointage) {
        this._pointage = value;
    }

    get etat(): EtatTentative {
        return this._etat;
    }

    set etat(value: EtatTentative) {
        this._etat = value;
    }
}

