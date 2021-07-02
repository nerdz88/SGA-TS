import { EspaceCours } from "./EspaceCours"
export class User {
    // classe inspirée de la classe conceptuelle (du MDD) et SGB
    private _id: number;
    private _nom: string;
    private _prenom: string;
    private _email: string;

    constructor(id: number, nom: string, prenom: string, email: string) {
        this._nom = nom;
        this._prenom = prenom;
        this._email = email;
        this._id = id;
    }

    public getId() {
        return this._id;
    }

    public getNom() {
        return this._nom;
    }

    public getPrenom() {
        return this._prenom;
    }

    public getEmail() {
        return this._email;
    }
}