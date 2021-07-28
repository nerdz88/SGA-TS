import { Universite } from '../service/Universite';

export class GestionnaireQuestion {
    // classe contrôleur GRASP

    private universite: Universite;

    constructor(universite: Universite) {
        this.universite = universite;
    }
    public ajouterQuestion(idEspaceCours: number, jsonString: string) {
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        espaceCours.ajouterQuestion(jsonString);
    }

    public modifierQuestion(idEspaceCours: number, IdQuestion: number, jsonString: string) {
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        espaceCours.modifierQuestion(IdQuestion, jsonString);
    }

    public recupererToutesQuestions(idEnseignant: number): string {
        let arrayEspaceCours = this.universite.recupererTousEspaceCours(idEnseignant)
        if (arrayEspaceCours.length == 0)
            return "[]";
        return JSON.stringify(arrayEspaceCours.flatMap(ec => {
            let questions = ec.recupererToutesQuestions();
            return questions.length > 0 ? questions : []
        }));
    }

    public recupererToutesQuestionsEspaceCours(idEspaceCours: number): string {
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        return JSON.stringify(espaceCours.recupererToutesQuestions());
    }

    public recupererUneQuestion(idEspaceCours: number, IdQuestion: number) {
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        return JSON.stringify(espaceCours.recupererUneQuestion(IdQuestion));
    }

    public supprimerQuestion(idEspaceCours: number, IdQuestion: number): boolean {
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        return espaceCours.suprimerQuestion(IdQuestion)
    }
}