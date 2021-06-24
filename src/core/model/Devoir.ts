import { AlreadyExistsError } from '../errors/AlreadyExistsError';
import { EspaceCours } from "./EspaceCours"
import {Remise} from "./Remise";

export class Devoir {
    private _id: number;
    private _idEspaceCours: number
    private _nom: string;
    private _description: string;
    private _noteMaximale: number;
    private _dateDebut: Date;
    private _dateFin: Date;
    private _visible: boolean;
    private _remises: Remise[];
    static currentId: number = 0;

    constructor(devoirJson: string) {
        let values = JSON.parse(devoirJson);
        this._nom = values.nom;
        this._description = values.description;
        this._noteMaximale = values.noteMaximale;
        this._dateDebut = values.dateDebut;
        this._dateFin = values.dateFin;
        this._visible = values.visible;
        //TODO INIT LA LISTE DE REMISE
        this._id = ++Devoir.currentId;
    }

    get nom(): string {
        return this._nom;
    }

    set nom(value: string) {
        this._nom = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get noteMaximale(): number {
        return this._noteMaximale;
    }

    set noteMaximale(value: number) {
        this._noteMaximale = value;
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

    get visible(): boolean {
        return this._visible;
    }

    set visible(value: boolean) {
        this._visible = value;
    }
}