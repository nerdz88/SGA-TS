import { AlreadyExistsError } from '../errors/AlreadyExistsError';
import { EspaceCours } from "./EspaceCours"

export class Devoir {
    private _nom: string;
    private _description: string;
    private _noteMaximale: number;
    private _dateDebut: Date;
    private _dateFin: Date;
    private _visible: boolean;


    constructor(nom: string, description: string, noteMaximale: number, dateDebut: Date, dateFin: Date, visible: boolean) {
        this._nom = nom;
        this._description = description;
        this._noteMaximale = noteMaximale;
        this._dateDebut = dateDebut;
        this._dateFin = dateFin;
        this._visible = visible;
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