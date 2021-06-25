import { Universite } from '../service/Universite';

export class GestionnaireQuestionnaire {

    private universite: Universite;

    constructor(universite: Universite) {
        this.universite = universite;
    }
    public ajouterQuestion(idQuestionnaire,idEspaceCours: number, arrayIdQuestionsAjouter: string) {
        let arrayIdQuestion = JSON.parse(arrayIdQuestionsAjouter);
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours)
        let questions = arrayIdQuestion.map((id)=>{
            return espaceCours.recupererUneQuestion(id)
        }).filter((element)=>element!==undefined)
        espaceCours.recupererUnQuestionnaire(idQuestionnaire).setQuestion(questions)
    }

    public recupererToutQuestionnaires(idEspaceCours: number) :string{
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours)
        return JSON.stringify(espaceCours.recupererToutQuestionnaires())
    }

    
    recupererTagQuestionParEspaceCours(id: number) {
        return this.universite.recupererTagQuestionParEspaceCours(id)
    }

    
    recupererQuestionParTag(id: number,tag : string) {
        return JSON.stringify(this.universite.recupererToutesQuestionsParTag(id,tag))
    }

    public recupererQuestionnaireParId(idEspaceCours: number,idQuestionnaire:number){
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours)
        return JSON.stringify(espaceCours.
            recupererToutQuestionnaires().
            find((q)=>q.getId()==idQuestionnaire))
    }

    public creerQuestionnaire(idEspaceCours:number,questionnaireValue : string){
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        console.log(espaceCours);
        espaceCours.ajouterQuestionnaire(questionnaireValue)
    }    

    public supprimerQuestionnaire(idEspaceCours: number, IdQuestion: number): boolean {
        return true;
    }

    public modifierQuestionnaire(idEspaceCours: number, IdQuestion: number): boolean {
        return true;
    }
}