import { AlreadyExistsError } from "../errors/AlreadyExistsError";
import { NotFoundError } from "../errors/NotFoundError";
import { Cours } from "../model/Cours";
import { EspaceCours } from "../model/EspaceCours";
import { SGBService } from "./SGBService";

export class Universite {
    private arrayEspaceCours: EspaceCours[]
    private arrayCours: Cours[]
    constructor() {
        this.arrayEspaceCours = new Array();
        this.arrayCours = new Array();
    }

    //Reset pour les tests
    public reset() {
        this.arrayEspaceCours = new Array();
        this.arrayCours = new Array();
    }

    public recupererTagQuestionParEspaceCours(idEspaceCours : number): string[] {
        let arrayTag=[];
        let espace = this.recupererUnEspaceCours(idEspaceCours);
        espace.recupererToutesQuestions().forEach((question)=>{
            question.getTag().forEach((value)=>{
                if(arrayTag.findIndex(t => t == value)==-1){
                    arrayTag.push(value)
                }
            })
        })
        console.log(arrayTag)
        return arrayTag;
    }

    public recupererQuestionnaireParEspaceCours(idEspaceCours : number){
        let espace = this.recupererUnEspaceCours(idEspaceCours);
        /*let array=this.arrayEspaceCours.map((espaceCours)=>{
            return espaceCours.getID()==idEspaceCours ? espaceCours.recupererToutQuestionnaires(): undefined
        }).filter(function( element ) {return element !== undefined;});*/
        console.log(espace.recupererToutQuestionnaires())
        return espace.recupererToutQuestionnaires();
    }
    

    public recupererToutesQuestionsParTag(idEspaceCours: number,tag: string){
        let espaceCours=this.recupererUnEspaceCours(idEspaceCours);
        let questions=espaceCours.recupererToutesQuestions().filter((question)=>{
            let index=question.getTag().findIndex(t => t==tag)
            return index!=-1;
        })
        console.log(questions)
        return questions;
    }

    public async ajouterEspaceCours(coursSGB: any, token: string, idEnseignant: number) {
        if (this.getIndexEspaceCoursById(coursSGB._id) != -1) {
            throw new AlreadyExistsError(coursSGB._titre + " ,gr: " + coursSGB._id + " a déjà été choisi par un autre enseignant");
        }

        let cours = this.getCoursBySigle(coursSGB._sigle);
        if (cours == undefined) {
            this.arrayCours.push(new Cours(coursSGB._sigle, coursSGB._titre, coursSGB._nb_max_student));
            cours = this.getCoursBySigle(coursSGB._sigle);
        }

        let etudiants = await SGBService.recupererEtudiant(token, coursSGB._id);

        let espaceCours = new EspaceCours(coursSGB._id,
            coursSGB._groupe,
            coursSGB._date_debut,
            coursSGB._date_fin,
            cours, idEnseignant);
        espaceCours.ajouterEtudiants(etudiants);
        this.arrayEspaceCours.push(espaceCours);
    }


    public recupererUnEspaceCours(id: number): EspaceCours {
        let index = this.getIndexEspaceCoursById(id);
        if (index == -1)
            throw new NotFoundError("L'espace cours " + id + " n'existe pas.");
        return this.arrayEspaceCours[index];
    }

    public recupererTousEspaceCours(idEnseignant: number): EspaceCours[] {
        //TODO filtrer selon le token
        let arrayEspaceCoursDeEnseignant = [];
        this.arrayEspaceCours.forEach(element => {
            if (element.getIdEnseignant() == idEnseignant) {
                arrayEspaceCoursDeEnseignant.push(element);
            }
        });
        return arrayEspaceCoursDeEnseignant;
    }

    public supprimerEspaceCours(id: number): boolean {
        let index = this.getIndexEspaceCoursById(id);
        if (index == -1) {
            return false;
        }
        this.arrayEspaceCours.splice(index, 1);
        return true;
    }

    private getCoursBySigle(sigle: string) {
        return this.arrayCours.find(c => c.getSigle() == sigle);
    }

    private getIndexEspaceCoursById(id: number) {
        return this.arrayEspaceCours.findIndex(c => c.getID() == id);
    }

}