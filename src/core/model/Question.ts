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
    constructor(questionJson: string) {   
        let question = JSON.parse(questionJson);         
        this._idGroupeCours = question.idGroupeCours;
        this._tags = question.tags.split(",");
        this._nom = question.nom;
        this._descriptionQuestion = question.descriptionQuestion;
        this._reponse = question.reponse;
        this._descriptionReponse = question.descriptionReponse
        this._mauvaiseReponseDescription = question.texteMauvaiseReponse;
        this.id = ++Question.currentId;
    }

    public modifier(questionJson: string) {
        let values = JSON.parse(questionJson);         
        this._tags = values.tags.split(",");
        this._nom = values.nom;
        this._descriptionQuestion = values.description;
        this._reponse = values.reponse;
        this._descriptionReponse = values.descriptionReponse
        this._mauvaiseReponseDescription = values.descriptionMauvaiseReponse;
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