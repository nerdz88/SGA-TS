import fetch = require('node-fetch');
import { AlreadyExistsError } from '../errors/AlreadyExistsError';
import { Cours } from '../model/Cours';
import { SGA } from "../model/SGA";
import { Operation, TYPES } from '../service/Operation';
import { Session } from "inspector";
import { OperationCours } from '../service/OperationCours';
import { OperationQuestion } from '../service/OperationQuestion';

export class EnseignantControlleur {
    // classe contrôleur GRASP
    private baseUrl: string = "http://127.0.0.1:3001";
    private endPoint: string = "/api/v1/";

    private sga: SGA;
    private operations: Map<String, Operation<any>>;

    constructor() {
        this.operations = new Map<String, Operation<any>>();
        this.operations.set(TYPES.COURS, new OperationCours());
        this.operations.set(TYPES.QUESTION, new OperationQuestion())
        // Rajouter les question,questionaires et devoirs à fur et à mesure

    }

    public async ajouterElement(params: any) {
        let operation = this.getOperationParCle(params.type);
        await operation.creerObjet(params);



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

    public recupererElement(type: string) {
        let operation = this.getOperationParCle(type);
        return operation.recupererObjet();
    }

    public recupererElementById(params: any) {
        let operation = this.getOperationParCle(params.type);
        return operation.recupererObjetParId(params.id);
    }

    public supprimerElement(params: any) : boolean {
        let operation = this.getOperationParCle(params.type);
        return operation.supprimerObjet(params);
    }

    public recupererElementSGB(params: any) {
        let operation = this.getOperationParCle(params.type);
        return operation.recupererJsonSGB(params)
    }

    public updateElement(params: any) {
        let operation = this.getOperationParCle(params.type);
        operation.updateObjet(params.id, params.values);
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