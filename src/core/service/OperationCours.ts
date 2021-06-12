import { NotFoundError } from '../errors/NotFoundError';
import { Cours } from '../model/Cours';
import fetch = require('node-fetch');
import { GroupeCours } from '../model/GroupeCours';
import { Operation } from './Operation';
export class OperationCours extends Operation<Cours> {

    constructor() {
        super();
    }

    async creerObjet(params: any) {
        let cours = params.cours;
        let index = this.operationObject.findIndex(c => c.getSigle() == cours._sigle);
        let etudiants = await this.recupererJsonSGB({ typeJson: "etudiant", id: cours._id, token: params.token });
        if (index != -1) {
            let groupe = new GroupeCours(cours._id, cours._groupe, cours._date_debut, cours._date_fin);
            groupe.ajouterEtudiants(etudiants);
            console.log(groupe);
            this.operationObject[index].ajoutGroupeCours(groupe);
        } else if (cours._sigle != null) {
            let course = new Cours(cours._sigle, cours._titre, cours._nb_max_student);
            let groupe = new GroupeCours(cours._id, cours._groupe, cours._date_debut, cours._date_fin);
            groupe.ajouterEtudiants(etudiants);
            course.ajoutGroupeCours(groupe);
            console.log(course);
            this.operationObject.push(course);
        }
    }


    recupererObjetParId(id: any) : string{
        let leCours: Cours = this.operationObject.find(c => c.getSigle() == id);
        if (leCours == undefined) {
            throw new NotFoundError("Le cours '" + id + "' n'existe pas.");
        }
        return JSON.stringify(leCours);
    }


    /**
     * 
     * @param params Sigle et groupe en params
     */
    supprimerObjet(params: any) : boolean {

        let indexCours = this.operationObject.findIndex(c => c.getSigle() == params.sigle);

        if (indexCours == -1)
            return false;
        let cours = this.operationObject[indexCours];

        if (cours.getTailleCours() == 1 && cours.getGroupeCours()[0].getID() == params.idGroupe)
            this.operationObject.splice(indexCours, 1);
        else {
            let indexGroupe = cours.getGroupeCours().findIndex(g => g.getID() == params.idGroupe);
            if (indexGroupe == -1)
                return false;
            cours.getGroupeCours().splice(indexGroupe, 1);
        }
        return true;
    }


    public updateObjet(id: number, values: any) {
        //Pas de update 
    }


   /* recupererObjet(params: any) :string{
        //const myJSON = JSON.stringify(this.operationObject);
        console.log("---------------------")
        let value="[]";
        if(this.operationObject==undefined || this.operationObject.length==0){
            return value;
        }
        value=this.operationObject.toString();
        console.log("shit")
        console.log(value)
        return value;

    }*/

    async recupererJsonSGB(params: any) {

        switch (params.typeJson) {
            case "cours": {
                const reponse = await fetch("http://127.0.0.1:3001/api/v1/courses", { headers: { token: params.token } })
                const json = await reponse.json();
                return json;
            }
            case "etudiant": {
                const reponse = await fetch("http://127.0.0.1:3001/api/v1/course/" + params.id + "/students",
                    { headers: { token: params.token } })
                const json = await reponse.json()
                return json.data;
            }
        }
    }
    /**
     * 
     * @param params prend un nouveau coursSGB en paramètre...
     */
    /*updateObjet(params: any): void {
        if(params.cours==null){
            //throw new exception
        }
        this.supprimerObjet({sigle:params.cours._sigle,groupe:params._id})
        this.creerObjet(params.cours)
    }*/
}