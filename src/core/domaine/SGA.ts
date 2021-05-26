import {Cours} from "./Cours";
export class SGA {
    private catalogueCours: Map<string, Cours>; // clé=sigle
    //Enseignant attribut dans le futur
    // array d'operation dans le futur
    constructor() {
        this.catalogueCours = new Map<string, Cours>();
    }

    public getCatalogue(){
        return this.getCatalogue();
    }

    /**
     *  opérations systèmes
     */

    //Créer un cours... recoit un array de cours du sgb
    public buildCours(data){
        //TODO si array est null retourner une exception
        data.forEach(element => {
            let cours=this.catalogueCours.get(element._sigle);
            if(cours==null){
                cours = new Cours(element._titre,element._sigle,element._date_debut,element._date_fin);
                cours.ajoutGroupeCours(element._groupe,element._nb_max_student,element._id);
                this.catalogueCours.set(element._sigle,cours);
            }else{
                cours.ajoutGroupeCours(element._groupe,element._nb_max_student,element._id);
            }
        }); 
        return this.catalogueCours;      
    }

    


}