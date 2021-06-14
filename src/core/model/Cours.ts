import { AlreadyExistsError } from '../errors/AlreadyExistsError';
import { GroupeCours } from "./GroupeCours"
export class Cours {
    // classe inspirée de la classe conceptuelle (du MDD)
    private _sigle: string;
    private _titre: string;
    private _nbMaxEtudiant: number;
    private groupeCours: GroupeCours[]
    constructor(sigle: string, titre: string, nbMaxEtudiant: number) {
        this._titre = titre;
        this._sigle = sigle;
        this._nbMaxEtudiant = nbMaxEtudiant;
        this.groupeCours = new Array()
    }

    public ajoutGroupeCours(groupeCours: GroupeCours): void {
        if (this.groupeCours.find(c => c.getID() == groupeCours.getID()) != undefined) {
            throw new AlreadyExistsError("Le groupe " + this.getSigle() + "-" + groupeCours.getID() + " existe déjà");
        }
        this.groupeCours.push(groupeCours)
    }

    public getSigle() {
        return this._sigle;
    }

    public getTitre() {
        return this._titre;
    }

    public getNbMaxEtudiant() {
        return this._nbMaxEtudiant;
    }

    public getGroupeCoursByID(idCoursGroupe: number): GroupeCours {
        return this.groupeCours.find(c => c.getID() == idCoursGroupe);
    }

    public getGroupeCours() {
        return this.groupeCours;
    }

    public deleteGroupeById(id: number) {
        this.groupeCours.forEach((groupeCours, index) => {
            if (groupeCours.getID() == id) {
                this.groupeCours.splice(index, 1);
                //break;
            }
        });
    }

    public getTailleCours() {
        return this.groupeCours.length
    }
}