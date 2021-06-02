import { NotFoundError } from '../errors/NotFoundError';
import {Cours} from '../model/Cours';
import fetch = require('node-fetch');
import { GroupeCours } from '../model/GroupeCours';
import {Operation} from './Operation';
export class OperationCours extends Operation<Cours> {

    constructor(){
        super();
    }


    async creerObjet(params: any): Promise<void>{
        try {
            let cours = params.cours;
            let index=-1;
            if(this.operationObject!=undefined){
                this.operationObject.forEach((c,i)=>{if(c.getSigle()==cours._sigle){ index=i}})
            }

            let etudiants = await this.recupererJsonSGB({typeJson:"etudiant", id:cours._id, token: params.token})
            if(index!=-1){
                let groupe = new GroupeCours(cours._id, cours._groupe, cours._date_debut, cours._date_fin)
                groupe.ajouterEtudiants(etudiants);
                console.log(groupe);
                this.operationObject[index].ajoutGroupeCours(groupe);
            }else if(cours._sigle!=null){
                let course = new Cours(cours._sigle,cours._titre,cours._nb_max_student);
                let groupe = new GroupeCours(cours._id, cours._groupe, cours._date_debut, cours._date_fin)
                groupe.ajouterEtudiants(etudiants);
                course.ajoutGroupeCours(groupe);
                console.log(course);
                this.operationObject.push(course);                
            }
        }
        catch(error) {
           //return new Promise<fail
            return error;
        }

    }

    
    recupererObjetParId(id: any) {
        let leCours: Cours = this.operationObject.find(c => c.getSigle() == id);
        if (leCours == undefined) {
            throw new NotFoundError("Le cours '" + id + "' n'existe pas.");
        }
        return leCours;
    } 
    

    /**
     * 
     * @param params Sigle et groupe en params
     */
    supprimerObjet(params: any): void {
        if(params.sigle!=null && params.groupe !=null){
            let cours = this.recupererObjetParId(params.sigle);
            cours.deleteGroupeById(params.groupe);
            if(cours.getTailleCours()==0){
                this.operationObject.forEach((cours,index)=>{
                    if(cours.getSigle()==params.sigle){
                        delete this.operationObject[index];
                    }
                })
            }else{
                //throw new exception
            }
        }

    }
    recupererObjet(params: any) {
        if (this.operationObject == undefined)
           return [];
        return this.operationObject;
    }
    
    async recupererJsonSGB(params: any){

        switch(params.typeJson){
            case "cours":{
                const reponse = await fetch("http://127.0.0.1:3001/api/v1/courses", { headers: { token: params.token } })
                const  json = await reponse.json();
                return json;
            }
            case "etudiant":{
                const reponse = await fetch("http://127.0.0.1:3001/api/v1/course/"+ params.id + "/students",
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
    updateObjet(params: any): void {
        if(params.cours==null){
            //throw new exception
        }
        this.supprimerObjet({sigle:params.cours._sigle,groupe:params._id})
        this.creerObjet(params.cours)
    }
}