import { Type } from 'class-transformer';
import { HttpError } from '../errors/HttpError';
import { NotFoundError } from '../errors/NotFoundError';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { Etat } from './enum/Etat';
import { Etudiant } from './Etudiant';
import { Remise } from "./Remise";
import moment = require('moment');

export class Devoir {
    private _id: number;
    private _idEspaceCours: number
    private _nom: string;
    private _description: string;
    private _noteMaximale: number;
    private _dateDebut: Date;
    private _dateFin: Date;
    private _visible: boolean;
    @Type(() => Remise)
    private _remises: Remise[];

    static currentId: number = 0;

    constructor(devoirJson: string, etudiants: Etudiant[]) {
        if (devoirJson == undefined)
            return;

        let values = JSON.parse(devoirJson);
        this._nom = values.nom;
        this._idEspaceCours = values.idEspaceCours
        this._description = values.description;
        this._noteMaximale = values.noteMaximale;
        this._dateDebut = values.dateDebut;
        this._dateFin = values.dateFin;
        this._visible = values.visible;
        this._remises = this.initRemises(etudiants);
        this._id = ++Devoir.currentId;
    }

    private initRemises(etudiants: Etudiant[]): Remise[] {
        var listRemise = [];
        etudiants.forEach(etudiant => listRemise.push(new Remise(etudiant)));
        return listRemise;
    }

    public getRemiseById(idRemise: number) {
        let remise = this.remises.find(r => r.id == idRemise);
        if (remise == undefined)
            throw new NotFoundError(`La remise [${idRemise}] n'existe pas dans le devoir [${this.id}]`);

        return remise;
    }

    public remettreDevoir(idEtudiant: number, pathFichier: string) {
        let dateDebut = moment(this._dateDebut, "DD-MM-YYYY")
        let dateFin = moment(this._dateFin, "DD-MM-YYYY")
        if (!this._visible || !moment(new Date()).isBetween(dateDebut, dateFin))
            throw new HttpError("Le devoir ne permet pas de remises")
        let remise = this._remises.find(r => r.etudiant.getId() == idEtudiant);
        if (remise == undefined)
            throw new UnauthorizedError("L'??tudiant n'a pas acc??s au devoir");

        remise.pathFichier = pathFichier;
        remise.dateRemise = new Date();
        remise.etat = Etat.Remis;
    }

    public corrigerDevoir(idRemise: number, note: number, pathFichierCorrection: string) {
        let remise = this._remises.find(r => r.id == idRemise);
        if (remise == undefined)
            throw new NotFoundError("Impossible de corriger le devoir, la remise [" + idRemise + "] n'existe pas");
        remise.note = note;
        remise.pathFichierCorrection = pathFichierCorrection;
        remise.dateDeCorrection = new Date();
        remise.etat = Etat.RemisCorrige;
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

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get idEspaceCours(): number {
        return this._idEspaceCours;
    }

    set idEspaceCours(value: number) {
        this._idEspaceCours = value;
    }

    get remises(): Remise[] {
        return this._remises;
    }

    set remises(value: Remise[]) {
        this._remises = value;
    }

    public modifier(jsonString: string) {
        let values = JSON.parse(jsonString);
        this._nom = values.nom;
        this._idEspaceCours = values.idEspaceCours
        this._description = values.description;
        this._noteMaximale = values.noteMaximale;
        this._dateDebut = values.dateDebut;
        this._dateFin = values.dateFin;
        this._visible = values.visible;
        //TODO INIT LA LISTE DE REMISE
    }


}


