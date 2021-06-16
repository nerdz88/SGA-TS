import fetch = require('node-fetch');
import { Operation, TYPES } from '../service/Operation';
import { OperationQuestion } from '../service/OperationQuestion';
import { SGBService } from '../service/SGBService';
import { Universite } from '../service/Universite';

export class GestionnaireQuestion {
    // classe contrôleur GRASP
    //private operations: Map<String, Operation<any>>;

    private universite : Universite;
    constructor(universite : Universite) {
        this.universite = universite;
    }
    public async ajouterQuestion(idEspaceCours, ) {

        /*let questionJson = JSON.parse(element);
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
        this.operationObject.push(questionObject);*/


    }

    public recupererToutesQuestions(token: string): string {
        return JSON.stringify(this.universite.recupererTousEspaceCours(token));

    }

    public recupererUneQuestion(id: number) {
        return JSON.stringify(this.universite.recupererUnEspaceCours(id));
    }

   /* public supprimerQuestion(idEspace: number,idQuestion : number): boolean {
        return this.universite.supprimerEspaceCours(idEspace)
    }*/

    public modifierQuestion(id: number): boolean {
        return this.universite.supprimerEspaceCours(id)
    }

}