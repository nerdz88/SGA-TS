import { GroupeCours } from "./GroupeCours"
export abstract class User {
    // classe inspirée de la classe conceptuelle (du MDD) et SGB
    private _id: number;
    private _nom: string;
    private _prenom: string;
    private _email: string;
    private _groupes: [GroupeCours]

    constructor(id: number, nom: string, prenom: string, email: string, groupe: [GroupeCours]) {
        this._nom = nom;
        this._prenom = prenom;
        this._email = email;
        this._id = id;
        this._groupes = groupe;
    }

    public getId() {
        return this._id;
    }

    public getGroupes() {
        return this._groupes;
    }

    public getNom() {
        return this._nom;
    }

    public getPrenom() {
        return this._prenom;
    }

    public geEmail() {
        return this._email;
    }

    public abstract toJSON();
}