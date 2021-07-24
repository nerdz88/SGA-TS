export enum TypeQuestion {

    "question-choix-multiples" = 1,
    "question-vrai-faux" = 2,
    "question-mise-correspondance" = 3,
    "question-reponse-courte" = 4,
    "question-numerique" = 5,
    "question-essay" = 6
}

export namespace TypeQuestion {
    export function getTitle(type: string): string {
        let value = "";
        switch (type) {
            case "question-choix-multiples": {
                value = "Choix multiples";
                break;
            }
            case "question-vrai-faux": {
                value = "Vrai Faux";
                break;
            }
            case "question-mise-correspondance": {
                value = "Mise en correspondance";
                break;
            }
            case "question-reponse-courte": {
                value = "Réponse courte";
                break;
            }
            case "question-numerique": {
                value = "Numérique";
                break;
            }
            case "question-essay": {
                value = "essaie";
                break;
            }
        }
        return value;
    }
}