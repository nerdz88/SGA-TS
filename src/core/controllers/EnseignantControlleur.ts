import fetch = require('node-fetch');
import { Operation, TYPES } from '../service/Operation';
import { OperationCours } from '../service/OperationCours';
import { OperationQuestion } from '../service/OperationQuestion';

export class EnseignantControlleur {
    // classe contrôleur GRASP
    private baseUrl: string = "http://127.0.0.1:3001";
    private endPoint: string = "/api/v1/";
    private operations: Map<String, Operation<any>>;

    constructor() {
        this.operations = new Map<String, Operation<any>>();
        this.operations.set(TYPES.COURS, new OperationCours());
        this.operations.set(TYPES.QUESTION, new OperationQuestion())
        // Rajouter les question,questionaires et devoirs à fur et à mesure

    }

    public async ajouterElement(type: string, element: string, token?: string) {
        let operation = this.getOperationParCle(type);
        await operation.creerObjet(element, token);



        //TODO on peut use ça pour les tests...

        /*operation.creerObjet(params);
        let value = JSON.parse(params.question);
        value.nom="sldsdllsd";
        operation.creerObjet({question:value});
        console.log(operation.recupererObjet(null));
        console.log(operation.recupererObjetParId(1));
        console.log(operation.recupererObjetParId(2));
        console.log("supprimer")
        operation.supprimerObjet(1);
        console.log(operation.recupererObjet(null));*/
    }

    public recupererElement(type: string) : string{
        let operation = this.getOperationParCle(type);
        return operation.recupererObjet();
    }

    public recupererElementById(type: string, id: any) :string{
        let operation = this.getOperationParCle(type);
        return operation.recupererObjetParId(id);
    }

    /**
     * 
     * @param type 
     * @param id recoit soit une string soit un entier
     * @param idGroupe recoit soit une string soit un entier
     * @returns 
     */
    public supprimerElement(type: string, id: any, secondId?: any) {
        let operation = this.getOperationParCle(type);
        return operation.supprimerObjet(id, secondId);
    }

    public updateElement(type: string, idElement: any, newElement: string) {
        let operation = this.getOperationParCle(type);
        operation.updateObjet(idElement, newElement);
    }


    private getOperationParCle(cle: string) {
        if (this.operations.has(cle)) {
            return this.operations.get(cle);
        }
        //throw new exception....
    }

    public async login(username: string, password: string) {
        const response = await fetch(this.baseUrl + this.endPoint +
            'login?email=' + encodeURIComponent(username) + '&password=' + password);
        return await response.json();
    }

}