import { exception } from 'console';
import fetch = require('node-fetch');
import { NotFoundError } from '../errors/NotFoundError';
import { SGBService } from '../service/SGBService';
import { Universite } from '../service/Universite';

export class GestionnaireCours {
    // classe contrôleur GRASP
    //private operations: Map<String, Operation<any>>;

    private universite : Universite;


    constructor(universite : Universite) {
        this.universite = universite;
    }

    public async ajouterCours(element: string, token: string){
        //let operation = this.getOperationParCle(type);
        let cours = JSON.parse(element)
        let etudiants = await SGBService.recupererEtudiant("etudiant", cours._id, token);
        if (etudiants.message != 'Success') {
            throw new NotFoundError("erreur dans le sgb, etudiants introuvables")
        }
        //return await operation.creerObjet(element, token);
        this.universite.ajouterCours(etudiants.data,cours._id,cours._groupe,cours._sigle,
            cours._titre,cours._nb_max_student,
            cours._date_debut,cours._date_fin,token);
    }

    public recupererCours(){
        let cours = this.universite.recupererCours();
        if (cours == undefined || cours.length == 0) {
            return "[]";
        }
        return JSON.stringify(cours);
    }

    supprimerCours(sigle: string, idGroupe: number) {
        this.universite.supprimerCours(sigle,idGroupe)
    }


    /*public async ajouterElement(type: string, element: string, token?: string) {
        return await operation.creerObjet(element, token);
    }

    public recupererElement(type: string) : string{
        return operation.recupererObjet();
    }

    public recupererElementById(type: string, id: any) :string{
        return operation.recupererObjetParId(id);
    }
    public supprimerElement(type: string, id: any, secondId?: any) {
        let operation = this.getOperationParCle(type);
        return operation.supprimerObjet(id, secondId);
    }

    public updateElement(type: string, idElement: any, newElement: string) {
        let operation = this.getOperationParCle(type);
        operation.updateObjet(idElement, newElement);
    }*/


    //TODO On devrait déplacer le login dans un autre controleur
    /*public async login(username: string, password: string) {
        return await SGBService.login(username, password);
    }*/

}