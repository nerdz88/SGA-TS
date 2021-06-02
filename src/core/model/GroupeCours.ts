import { InvalidParameterError } from '../errors/InvalidParameterError';
import { Cours } from './Cours';
import { Etudiant } from "./Etudiant";
export class GroupeCours {
    // classe inspirée de la classe conceptuelle (du MDD)
    private _id: number;
    private _numero: string;
   
    private _etudiants: Etudiant[];
    private _dateDebut: string;// string pour l'instant, possibilité de Date
    private _dateFin: string; // string pour l'instant, possibilité de Date
  //  private _cours: Cours;

    constructor(id: number, numero: string, dateDebut: string, dateFin: string) {
        this._id = id;
        this._numero = numero;
      
        this._dateDebut = dateDebut;
        this._dateFin = dateFin;
        //this._cours = cours;
        this._etudiants = [];
    }
    
    ajouterEtudiants(etudiants: any) {
        etudiants.forEach((element) => {
           this._etudiants.push(new Etudiant(element._id, element._last_name, element._first_name, element._email, element._permanent_code));
        }) 
    }

    public getID() {
        return this._id;
    }

    public getNumero() {
        return this._numero;
    }

    public getEtudiants(): Etudiant[] {
        return this._etudiants;
    }

    public getDateDebut() {
        return this._dateDebut;
    }
    public getDateFin() {
        return this._dateFin;
    }

    // public getCours() {
    //     return this._cours;
    // }

    // public toJSON() {
    //     return {
    //         nb_max_student: this._nb_max_student,
    //         numero: this._numero,
    //         etudiants: this._etudiants
    //     };
    // }
}