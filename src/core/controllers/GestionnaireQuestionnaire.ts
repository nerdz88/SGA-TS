import { Universite } from '../service/Universite';

export class GestionnaireQuestionnaire {

    private universite: Universite;

    constructor(universite: Universite) {
        this.universite = universite;
    }
    public ajouterQuestion(idEspaceCours: number, jsonString: string) {
        
    }

    public creerQuestionnaire(idEnseignant:number, idEspaceCours:number, nom : string, description: string, etat : String){

    }
    

    /*
    dans université
    public recupererTagQuestionParEnseignant(idEnseignant: number,idEspaceCours : number): string {
        return;
    }

    public recupererQuestionnaireParEspaceCours(idEspaceCours : number){
        
    }

    public recupererToutesQuestionsParTag(idEspaceCours: number,tag: string){
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        //avoir une méthode qui recupereToutesQuestionsParTag dans espaceCours
        //espaceCours.recupererToutesQuestions()
    }*/
    

    public supprimerQuestionnaire(idEspaceCours: number, IdQuestion: number): boolean {
        return true;
    }

    public modifierQuestionnaire(idEspaceCours: number, IdQuestion: number): boolean {
        return true;
    }
}