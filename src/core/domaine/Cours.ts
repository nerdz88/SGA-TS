import { threadId } from 'worker_threads';
import { InvalidParameterError } from '../errors/InvalidParameterError';
import {GroupeCours} from "./GroupeCours"
export class Cours {
    // classe inspirée de la classe conceptuelle (du MDD)
    private _titre : string;
    private _sigle : string;
    private _dateDebut : string;// string pour l'instant, possibilité de Date
    private _dateFin : string; // string pour l'instant, possibilité de Date
    private groupeCours : Set<GroupeCours>;

    constructor(titre : string, sigle : string, dateDebut : string, dateFin : string) {
        this._titre = titre;
        this._sigle = sigle;
        this._dateDebut = dateDebut;
        this._dateFin = dateFin;
        this.groupeCours = new Set();
    }

    public ajoutGroupeCours(numero : string, nb_max_student: number,id : number){
        let groupe = new GroupeCours(id,numero, nb_max_student);
        return this.groupeCours.add(groupe);
    }

    public getDateDebut() {
        return this._dateDebut;
    }
    public getDateFin() {
        return this._dateFin;
    }
    public getGroupeCours() {
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
            sigle: this._sigle,
            titre: this._titre,
            dateDebut: this._dateDebut,
            dateFin: this._dateFin,
            groupeCours: this.groupeCours
		};
    }
}