import { NotFoundError } from '../errors/NotFoundError';
import {Cours} from '../model/Cours';
import fetch = require('node-fetch');
import { GroupeCours } from '../model/GroupeCours';
import {Operation} from './Operation';
export class OperationCours extends Operation<Cours> {

    constructor(){
        super();
    }


    creerObjet(params: any): void {
        try{
            if(super.operationObject.find(c => c.getSigle() == params._sigle)){

            }else{
                let cours = new Cours(params.sigle,params._titre,params._nb_max_student);
                let groupe = new GroupeCours(params._id, params._groupe, params.date_debut, params.date_fin)
                cours.ajoutGroupeCours(groupe)
                super.operationObject.push(cours);
            }
        }catch(error){
            
        }
    }

    
    recupererObjetParId(id: any) {
        let leCours: Cours = super.operationObject.find(c => c.getSigle() == id);
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
                super.operationObject.forEach((cours,index)=>{
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
        if (super.operationObject == undefined)
           return [];
        return super.operationObject;
    }
    
    async recupererJsonSGB(params: any){

        switch(params.typeJson){
            case "cours":{
                const reponse = await fetch("http://127.0.0.1:3001/api/v1/courses", { headers: { token: params.token } })
                const  json = await reponse.json();
                return json;
            }
            case "etudiant":{
                const reponse = await fetch("http://127.0.0.1:3001/api/v1/courses"+ params.id + "/students",
                 { headers: { token: params.token } })
                const json = await reponse.json()
                return json;
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