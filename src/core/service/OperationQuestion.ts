import { Operation } from './Operation';
import { Question } from "../model/Question"
import { NotFoundError } from '../errors/NotFoundError';
import { AlreadyExistsError } from '../errors/AlreadyExistsError';
export class OperationQuestion extends Operation<Question> {

    constructor() {
        super();
    }

    creerObjet(element: string, token?: string): void {
        let questionJson = JSON.parse(element);
        //TODO MORE VALIDATION
        if (this.existeQuestion(questionJson.nom, -1)) {
            throw new AlreadyExistsError("la question " + questionJson.nom + " existe déjà")
        }
        let questionObject = new Question(questionJson.idCoursGroupe,
            questionJson.tags.split(","),
            questionJson.nom,
            questionJson.description,
            questionJson.reponse,
            questionJson.descriptionReponse,
            questionJson.descriptionMauvaiseReponse)
        this.operationObject.push(questionObject);
    }
    private existeQuestion(nom: any, idQuestion: number): boolean {
        return this.operationObject.find(q => q.getNom() == nom && q.getId() != idQuestion) != undefined;
    }

    public updateObjet(idQuestion: number, values: any) {
        let newElement = JSON.parse(values);
        if (this.existeQuestion(newElement.nom, idQuestion)) {
            throw new AlreadyExistsError("la question " + newElement.nom + " existe déjà")
        }
        this.recupererQuestionParId(idQuestion).update(newElement);
    }

    supprimerObjet(id: number, secondId?: any): boolean {
        let index = this.operationObject.findIndex(q => q.getId() == id);
        if (index != -1) {
            this.operationObject.splice(index, 1);
            return true;
        }
        return false;
    }
    recupererObjetParId(id: number): string {
        let question = this.recupererQuestionParId(id);
        return JSON.stringify(question);
    }
    private recupererQuestionParId(id: number) {
        let question: Question = this.operationObject.find(c => c.getId() == id);
        if (question == undefined) {
            throw new NotFoundError("La question '" + id + "' n'existe pas.");
        }
        return question;
    }
}