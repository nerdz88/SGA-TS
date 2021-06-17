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

    public modifierQuestion(idEspaceCours: number,IdQuestion: number, jsonString: string) {
        let espaceCours = this.universite.recupererUnEspaceCours(idEspaceCours);
        espaceCours.modifierQuestion(IdQuestion, jsonString);
    }

    public recupererToutesQuestions(token: string): string {
        let arrayEspaceCours = this.universite.recupererTousEspaceCours(token);
        return JSON.stringify(arrayEspaceCours.map(ec => ec.recupererToutesQuestions()));
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