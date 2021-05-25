import { InvalidParameterError } from '../errors/InvalidParameterError';
import {Etudiant} from "./Etudiant";
export class GroupeCours {
    // classe inspirée de la classe conceptuelle (du MDD)
    private _numero : string;
    private _nb_max_student : number;
    private _etudiants : Set<Etudiant>;
    //private _enseignant : Enseignant à créer

    constructor(numero : string, nb_max_student : number) {
        this._numero
        this._nb_max_student = nb_max_student; 
        this._etudiants = new Set();
    }

    get numero() {
        return this._numero;
    }

    get nb_max_student() {
        return this._nb_max_student;
    }

    get etudiants() {
        return this._etudiants;
    }

    public toJSON() {
        return {
            nb_max_student: this._nb_max_student,
            numero: this._numero,
            etudiants: this._etudiants
		};
    }
}