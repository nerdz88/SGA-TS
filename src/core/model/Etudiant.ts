import { User } from "./User";

export class Etudiant extends User {
    // classe inspirée de la classe conceptuelle (du MDD) et SGB
    private _code_permanent: string

    constructor(id: number, nom: string, prenom: string, email: string, codePermanent: string) {
        super(id, nom, prenom, email)
        this._code_permanent = codePermanent;
    }

    public getCodePermanent() {
        return this._code_permanent;
    }
}