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

    /*public async ajouterElement(type: string, element: string, token?: string) {
        let operation = this.getOperationParCle(type);
        return await operation.creerObjet(element, token);
    }

    public recupererElement(type: string) : string{
        let operation = this.getOperationParCle(type);
        return operation.recupererObjet();
    }

    public recupererElementById(type: string, id: any) :string{
        let operation = this.getOperationParCle(type);
        return operation.recupererObjetParId(id);
    }

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

    //TODO On devrait déplacer le login dans un autre controleur
    public async login(username: string, password: string) {
        return await SGBService.login(username, password);
    }*/

}