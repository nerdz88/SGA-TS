export class Cours {
    // classe inspirée de la classe conceptuelle (du MDD)
    private _sigle: string;
    private _titre: string;
    private _nbMaxEtudiant: number;

    constructor(sigle: string, titre: string, nbMaxEtudiant: number) {
        this._titre = titre;
        this._sigle = sigle;
        this._nbMaxEtudiant = nbMaxEtudiant;
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
}