import { Reponse } from "../reponses/Reponse";

export abstract class Question {
    // classe inspirée de la classe conceptuelle (du MDD)

    private _id: number;
    private _idEspaceCours: number
    private _tags: []
    private _nom: string
    private _descriptionQuestion: string
    private _nbOccurence: number
    static currentId: number = 0;
    protected _answerChoix: Reponse[];
    private _type:string;


    constructor(questionJson: string) {
        if (questionJson == undefined)
            return;

        this._answerChoix=[];
        let values = JSON.parse(questionJson);
        this._idEspaceCours = parseInt(values.idEspaceCours);
        this._type = values.typeQuestion;
        this._tags = values.tags ? values.tags.toLowerCase().split(",")
            .filter((tag, index, list) => list.indexOf(tag) === index) : [];
        this._nom = values.nom;
        this._descriptionQuestion = values.description;
        this._id = ++Question.currentId;
        this._nbOccurence = 0
    }


    public modifier(questionJson: string) {
        let values = JSON.parse(questionJson);
        this._tags = values.tags.toLowerCase().split(",")
            .filter((tag, index, list) => list.indexOf(tag) === index);
        this._nom = values.nom;
        this._descriptionQuestion = values.description;
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
    
    public getTag() {
        return this._tags;
    }

    public getType(){
        return this._type;
    }
    public getDescriptionQuestion() {
        return this._descriptionQuestion;
    }

    public setNbOccurence(nbOccurence: number) {
        this._nbOccurence = nbOccurence
    }
    
    public getNbOccurence() {
        return this._nbOccurence
    }
}