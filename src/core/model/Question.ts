export class Question {
    // classe inspirée de la classe conceptuelle (du MDD)
    private _idGroupeCours: number
    private _tags: []
    private _nom: string
    private _descriptionQuestion: string
    private _reponse: boolean
    private _descriptionReponse: string
    private _mauvaiseReponseDescription: string
    static currentId: number = 0;
    private id: number;
    constructor(idGroupeCours: number, tags: [], nom: string, descriptionQuestion: string,
        reponse: boolean, descriptionReponse: string, texteMauvaiseReponse: string) {
        this._idGroupeCours = idGroupeCours;
        this._tags = tags;
        this._nom = nom;
        this._descriptionQuestion = descriptionQuestion;
        this._reponse = reponse;
        this._descriptionReponse = descriptionReponse
        this._mauvaiseReponseDescription = texteMauvaiseReponse;
        this.id = ++Question.currentId;
    }


    public getGroupeCoursID() {
        return this._idGroupeCours;
    }
    public getId() {
        return this.id;
    }
    public getNom() {
        return this._nom;
    }
    public getReponse() {
        return this._reponse;
    }
    public getTag() {
        return this._tags;
    }

    public getDescriptionReponse() {
        return this._descriptionReponse;
    }
    public getMauvaiseReponseDescription() {
        return this._mauvaiseReponseDescription;
    }
    public getDescriptionQuestion() {
        return this._descriptionQuestion;
    }
}