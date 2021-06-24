enum Etat {
    NonRemis,
    Remis,
    RemisCorriger
}

export class Remise{

    private _id : number;
    private _idEtudiant : number;
    private _dateRemise : Date;
    private _note : number;
    private _etat :  Etat;
    private _dateDeCorrection : Date;


    constructor(id: number, idEtudiant: number, dateRemise: Date, note: number, etat: Etat, dateDeCorrection: Date) {
        this._id = id;
        this._idEtudiant = idEtudiant;
        this._dateRemise = dateRemise;
        this._note = note;
        this._etat = etat;
        this._dateDeCorrection = dateDeCorrection;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get idEtudiant(): number {
        return this._idEtudiant;
    }

    set idEtudiant(value: number) {
        this._idEtudiant = value;
    }

    get dateRemise(): Date {
        return this._dateRemise;
    }

    set dateRemise(value: Date) {
        this._dateRemise = value;
    }

    get note(): number {
        return this._note;
    }

    set note(value: number) {
        this._note = value;
    }

    get etat(): Etat {
        return this._etat;
    }

    set etat(value: Etat) {
        this._etat = value;
    }

    get dateDeCorrection(): Date {
        return this._dateDeCorrection;
    }

    set dateDeCorrection(value: Date) {
        this._dateDeCorrection = value;
    }
}

