import { threadId } from 'worker_threads';
import { InvalidParameterError } from '../errors/InvalidParameterError';
import { GroupeCours } from "./GroupeCours"
export class Cours {
    // classe inspirée de la classe conceptuelle (du MDD)
    private _sigle: string;
    private _titre: string;
    private _nbMaxEtudiant: number;

    private groupeCours: Map<number, GroupeCours>;

    constructor(sigle: string, titre: string, nbMaxEtudiant: number) {
        this._titre = titre;
        this._sigle = sigle;
        this._nbMaxEtudiant = nbMaxEtudiant;
        this.groupeCours = new Map<number, GroupeCours>();
    }

    public ajoutGroupeCours(groupeCours: GroupeCours): void {
        this.groupeCours.set(groupeCours.getID(), groupeCours);
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

    // public getGroupeCours(): Map {
    //     return this.groupeCours;
    // }

    public deleteGroupeById(id: number){
        this.groupeCours.delete(id)
    }

    public getTailleCours(){
        return this.groupeCours.size
    }

    public getGroupeCours(id: number): GroupeCours {
        return this.groupeCours.get(id);
    }
    // public toJSON() {
    //     return {
    //         id: this._id,
    //         sigle: this._sigle,
    //         titre: this._titre,
    //         dateDebut: this._dateDebut,
    //         dateFin: this._dateFin,
    //         groupeCours: this.groupeCours
    //     };
    // }
}