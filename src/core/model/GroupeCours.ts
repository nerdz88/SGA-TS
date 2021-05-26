import { InvalidParameterError } from '../errors/InvalidParameterError';
import {Etudiant} from "./Etudiant";
export class GroupeCours {
    // classe inspirée de la classe conceptuelle (du MDD)
    private _numero : string;
    private _nb_max_student : number;
    private _etudiants : Etudiant[];
   // private _id : number;
    //private _enseignant : Enseignant à créer

    constructor(numero : string, nb_max_student : number) {
        //this._id=id;
        this._numero = numero;
        this._nb_max_student = nb_max_student; 
        this._etudiants = [];
    }

    public getNumero() {
        return this._numero;
    }

    // public getId(){
    //     return this._id;
    // }

    public getNbMaxEtudiant() {
        return this._nb_max_student;
    }

    public getEtudiants(): Etudiant[] {
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