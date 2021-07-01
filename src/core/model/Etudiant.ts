export class Etudiant {
    // classe inspirée de la classe conceptuelle (du MDD) et SGB
    private _id: number;
    private _nom: string;
    private _prenom: string;
    private _email: string;
    private _code_permanent: string
    //array de cours dans un futur proche

    constructor(id: number, nom: string, prenom: string, email: string, codePermanent: string) {
        this._id = id;
        this._nom = nom;
        this._prenom = prenom;
        this._email = email;
        this._code_permanent = codePermanent;
    }
    public getId() {
        return this._id;
    }

    public getNomComplet() {
        return this.getNom() + ", " + this.getPrenom();
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
    public getCodePermanent() {
        return this._code_permanent;
    }
}