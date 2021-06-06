import { Operation } from './Operation';
import { Question } from "../model/Question"
import { NotFoundError } from '../errors/NotFoundError';
import { AlreadyExistsError } from '../errors/AlreadyExistsError';
export class OperationQuestion extends Operation<Question> {

    constructor() {
        super();
    }

    private getJSON(object: any) {
        try {
            let json = JSON.parse(object);
            return json;
        } catch (exception) {
            return object;
        }
    }

    creerObjet(params: any): void {
        let questionJson = this.getJSON(params.question);
        if (this.existeQuestion(questionJson.nom)) {
            throw new AlreadyExistsError("la question " + questionJson.nom + " existe déjà")
        }
        let questionObject = new Question(questionJson.numeroGroupe,
            questionJson.tags, questionJson.nom,
            questionJson.descriptionQuestion,
            questionJson.reponse,
            questionJson.descriptionReponse,
            questionJson.texteMauvaiseReponse)
        this.operationObject.push(questionObject);
    }
    private existeQuestion(nom: any): boolean {
        let existe = false;
        this.operationObject.forEach(element => {
            if (element.getNom() == nom) {
                existe = true;
            }
        });
        return existe;
    }

    supprimerObjet(id: any): boolean {
        if (id != null) {
            this.operationObject.forEach((question, index) => {
                if (question.getId() == id) {
                    this.operationObject.splice(index, 1);
                    return true;
                }
            });
        }
        return false;
    }
    recupererObjet(params: any) {
        return this.operationObject;
    }
    recupererObjetParId(id: any) {
        let question: Question = this.operationObject.find(c => c.getId() == id);
        if (question == undefined) {
            throw new NotFoundError("La question '" + id + "' n'existe pas.");
        }
        return question;
    }
    recupererJsonSGB(params: any) {

    }

    /*updateObjet(params: any): void {
        throw new Error('Method not implemented.');
    }*/

}