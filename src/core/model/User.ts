export class User {
    // classe inspirée de la classe conceptuelle (du MDD) et SGB
    protected _id: number;
    protected _nom: string;
    protected _prenom: string;
    protected _email: string;

    constructor(id: number, nom: string, prenom: string, email: string) {
        this._nom = nom;
        this._prenom = prenom;
        this._email = email;
        this._id = id;
    }

    public getNomComplet() {
        return this.getNom() + ", " + this.getPrenom();
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