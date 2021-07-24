import { UnauthorizedError } from "../errors/UnauthorizedError";
import { Question } from "../model/questions/Question";
import { EtatTentative, Tentative } from "../model/Tentative";
import { Universite } from "../service/Universite";

export class GestionnaireQuestionnaire {

    private universite: Universite;

    constructor(universite: Universite) {
        this.universite = universite;
    }

    public gererQuestionsQuestionnaire(idEspaceCours: number, idQuestionnaire: number, arrayIdQuestionsAjouter: string) {

        let arrayIdQuestion = JSON.parse(arrayIdQuestionsAjouter);
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        let questionnaire = espaceCours.recupererUnQuestionnaire(idQuestionnaire);

        if (questionnaire != null) {
            questionnaire.getQuestions().forEach((question) => {
                question.setNbOccurence(question.getNbOccurence() - 1)
            })
        }

        questionnaire.setQuestion([]);
        arrayIdQuestion.forEach(idQuestion => {
            if (idQuestion != "") {
                let question = espaceCours.recupererUneQuestion(idQuestion)
                let ajout = questionnaire.ajouterQuestion(question);
                if (ajout) {
                    question.setNbOccurence(question.getNbOccurence() + 1)
                }
            }
        });
    }

    public recupererTousQuestionnaires(idEnseignant: number): string {
        let arrayEspaceCours = this.universite.recupererTousEspaceCours(idEnseignant)
        if (arrayEspaceCours.length == 0) return "[]";

        return JSON.stringify(
            arrayEspaceCours.flatMap((ec) => {
                let questionnaires = ec.recupererToutQuestionnaires();
                return questionnaires.length > 0 ? questionnaires : [];
            })
        );
    }

    public recupererTousQuestionnairesEspaceCours(idEspaceCours: number): string {
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        return JSON.stringify(espaceCours.recupererToutQuestionnaires());
    }

    public recupererTagQuestionParEspaceCours(idEspaceCours: number) {
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        return JSON.stringify(espaceCours.recupererTagQuestions());
    }


    public recupererUnQuestionnaire(idEspaceCours: number, idQuestionnaire: number, ordreTri: number = 0) {
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        let questionnaire = espaceCours.recupererUnQuestionnaire(idQuestionnaire);
        questionnaire.setTentative(Tentative.orderBy(questionnaire.getTentative(), ordreTri));
        return JSON.stringify(questionnaire);
    }

    public faireTentativeEtudiant(idEspaceCours: number, idQuestionnaire: number, idEtudiant: number) {
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        let questionnaire = espaceCours.recupererUnQuestionnaire(idQuestionnaire);
        let tentative = questionnaire.getTentativeEtudiant(idEtudiant);

        if (tentative.etat == EtatTentative.NonComplete)
            tentative.commencerTentative();

        return JSON.stringify(tentative);
    }

    public terminerTentativeEtudiant(idEspaceCours: number, idQuestionnaire: number, idEtudiant: number) {
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        let questionnaire = espaceCours.recupererUnQuestionnaire(idQuestionnaire);
        let tentative = questionnaire.getTentativeEtudiant(idEtudiant);
        tentative.finirTentative();
    }

    public ajouterReponseTentative(idEspaceCours: number, idQuestionnaire: number, idQuestion: number, idEtudiant: number, responseJSON: string) {
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        let questionnaire = espaceCours.recupererUnQuestionnaire(idQuestionnaire);
        questionnaire.repondreQuestion(idQuestion, idEtudiant, responseJSON);
      



    }

    public recupererIdsQuestionsQuestionnaire(idEspaceCours: number, idQuestionnaire: number) {
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        let questionnnaire = espaceCours.recupererUnQuestionnaire(idQuestionnaire);
        return JSON.stringify(questionnnaire.getQuestions().map((q: Question) => q.getId()));
    }

    public creerQuestionnaire(idEspaceCours: number, questionnaireValue: string): number {
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        let idQuestionnaire = espaceCours.ajouterQuestionnaire(questionnaireValue);
        return idQuestionnaire;
    }

    public supprimerQuestionnaire(idEspaceCours: number, IdQuestionnaire: number): boolean {
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        return espaceCours.suprimerQuestionnaire(IdQuestionnaire);
    }

    public modifierQuestionnaire(idEspaceCours: number, IdQuestionnaire: number, jsonString: string) {
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        espaceCours.modifierQuestionnaire(IdQuestionnaire, jsonString);
    }


}
