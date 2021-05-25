import { threadId } from 'worker_threads';
import { InvalidParameterError } from '../errors/InvalidParameterError';
import {GroupeCours} from "./GroupeCours"
export class Cours {
    // classe inspirée de la classe conceptuelle (du MDD)
    private _id : string;
    private _titre : string;
    private _sigle : string;
    private _dateDebut : string;// string pour l'instant, possibilité de Date
    private _dateFin : string; // string pour l'instant, possibilité de Date
    private groupeCours : GroupeCours[];

    constructor(id: string,titre : string, sigle : string, dateDebut : string, dateFin : string) {
        this._id = id;
        this._titre = titre;
        this._sigle = sigle;
        this._dateDebut = dateDebut;
        this._dateFin = dateFin;
        this.groupeCours = [];
    }

    // public ajoutGroupeCours(numero : string, nb_max_student: number,id : number){
    //     let groupe = new GroupeCours(numero, nb_max_student);
    //     return this.groupeCours.add(groupe);
    // }

    public getID(): string {
        return this._id;
    }
    public getDateDebut() {
        return this._dateDebut;
    }
    public getDateFin() {
        return this._dateFin;
    }
    public getGroupeCours(): GroupeCours[] {
        return this.groupeCours;
    }
    public getTitre() {
        return this._titre;
    }
    public getSigle() {
        return this._sigle;
    }

    public toJSON() {
        return {
            id: this._id,
            sigle: this._sigle,
            titre: this._titre,
            dateDebut: this._dateDebut,
            dateFin: this._dateFin,
            groupeCours: this.groupeCours
		};
    }
}