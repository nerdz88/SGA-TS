export class Question {
    // classe inspirée de la classe conceptuelle (du MDD)

    private _id: number;
    private _idEspaceCours: number
    private _tags: []
    private _nom: string
    private _descriptionQuestion: string
    private _reponse: boolean
    private _descriptionReponse: string
    private _mauvaiseReponseDescription: string
    static currentId: number = 0;

    constructor(questionJson: string) {
        if (questionJson == undefined)
            return;

        let values = JSON.parse(questionJson);
        this._idEspaceCours = values.idEspaceCours;

        this._tags = values.tags.toLowerCase().split(",")
            .filter((tag, index, list) => list.indexOf(tag) === index);

        this._nom = values.nom;
        this._descriptionQuestion = values.description;
        this._reponse = values.reponse;
        this._descriptionReponse = values.descriptionReponse
        this._mauvaiseReponseDescription = values.descriptionMauvaiseReponse;
        this._id = ++Question.currentId;
    }

    public modifier(questionJson: string) {
        let values = JSON.parse(questionJson);
        this._tags = values.tags.toLowerCase().split(",")
            .filter((tag, index, list) => list.indexOf(tag) === index);
        this._nom = values.nom;
        this._descriptionQuestion = values.description;
        this._reponse = values.reponse;
        this._descriptionReponse = values.descriptionReponse
        this._mauvaiseReponseDescription = values.descriptionMauvaiseReponse;
    }

    public getIdEspaceCours() {
        return this._idEspaceCours;
    }
    public getId() {
        return this._id;
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