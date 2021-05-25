import { InvalidParameterError } from '../errors/InvalidParameterError';
import {User} from "./User";
export class Etudiant extends User{
    // classe inspirée de la classe conceptuelle (du MDD) et SGB
    private _code_permanent: string

    constructor(id : number, nom : string, prenom : string, email : string, codePermanent : string) {
        super(id,nom,prenom,email);
        this._code_permanent=codePermanent;
    }

    get CodePermanent(){
        return this._code_permanent;
    }
    public toJSON() {
        return {
            id: super.getId,
            nom: super.getNom,
            prenom: super.getPrenom,
            email: super.geEmail,
            codePermanent: this._code_permanent
		};
    }
}