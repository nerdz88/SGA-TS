import { NotFoundError } from '../errors/NotFoundError';
import { Cours } from '../model/Cours';
import { GroupeCours } from '../model/GroupeCours';
import { Operation } from './Operation';
import { SGBService } from './SGBService';
import { exception } from 'console';
export class OperationCours extends Operation<Cours> {

    constructor() {
        super();
    }

    async creerObjet(coursString: string, token?: string) {
        let cours = JSON.parse(coursString)
        //let cours = params.cours;
        let index = this.operationObject.findIndex(c => c.getSigle() == cours._sigle);
        let etudiants = await SGBService.recupererEtudiant("etudiant", cours._id, token);
        if (etudiants.message != 'Success') {
            throw new exception("erreur dans le sgb")
        }
        if (index != -1) {
            let groupe = new GroupeCours(cours._id, cours._groupe, cours._date_debut, cours._date_fin);
            groupe.ajouterEtudiants(etudiants.data);
            this.operationObject[index].ajoutGroupeCours(groupe);
        } else if (cours._sigle != null) {
            let course = new Cours(cours._sigle, cours._titre, cours._nb_max_student);
            let groupe = new GroupeCours(cours._id, cours._groupe, cours._date_debut, cours._date_fin);
            groupe.ajouterEtudiants(etudiants.data);
            course.ajoutGroupeCours(groupe);
            this.operationObject.push(course);
        }
    }


    recupererObjetParId(id: any): string {
        let leCours: Cours = this.operationObject.find(c => c.getSigle() == id);
        if (leCours == undefined) {
            throw new NotFoundError("Le cours '" + id + "' n'existe pas.");
        }
        return JSON.stringify(leCours);
    }


    /**
     * 
     * @param params Sigle et groupe en params
     */
    supprimerObjet(sigle: string, idGroupe?: number): boolean {

        let indexCours = this.operationObject.findIndex(c => c.getSigle() == sigle);

        if (indexCours == -1)
            return false;
        let cours = this.operationObject[indexCours];

        if (cours.getTailleCours() == 1 && cours.getGroupeCours()[0].getID() == idGroupe)
            this.operationObject.splice(indexCours, 1);
        else {
            let indexGroupe = cours.getGroupeCours().findIndex(g => g.getID() == idGroupe);
            if (indexGroupe == -1)
                return false;
            cours.getGroupeCours().splice(indexGroupe, 1);
        }
        return true;
    }


    public updateObjet(id: number, values: any) {
        //Pas de update 
    }
}