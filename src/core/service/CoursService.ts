import { NotFoundError } from "../errors/NotFoundError";
import { AlreadyExistsError } from "../errors/AlreadyExistsError";
import fetch = require('node-fetch');
import { Application, Request, Response } from 'express'
import { Cours } from "../model/Cours";
import { GroupeCours } from "../model/GroupeCours";
import { Etudiant } from "../model/Etudiant";


//Classe de service pour les Cours: Get,Add,Set,Delete
//Représente notre Catalogue de Cours
export class CoursService {

    //Key: token enseignant 
    private _coursSelonEnseignant: Map<string, Cours[]>;
    constructor() {
        this._coursSelonEnseignant = new Map<string, Cours[]>();
    }

    //On retroune les cours d'un prof sinon une liste vide!
    public recupererTousCours(token: string): Cours[] {
        let cours: Cours[] = this._coursSelonEnseignant.get(token);
        return cours ? cours : [];
    }

    public recupererUnCours(token: string, idCours: string): Cours {
        let leCours: Cours = this.recupererTousCours(token).find(c => c.getID() == idCours);
        if (leCours === undefined) {
            throw new NotFoundError("Le cours '" + idCours + "' n'existe pas.");
        }
        return leCours;
    }

    public coursExiste(token: string, idCours: string): boolean {
        return this.recupererTousCours(token).find(c => c.getID() == idCours) != undefined;        
    }

    public ajouterCours(token: string, leCours: Cours): void {
        let cours: Cours[] = this._coursSelonEnseignant.get(token);
        //Le prof est déjà dans la map
        if (cours === undefined) {
            cours = [];
            cours.push(leCours);
            this._coursSelonEnseignant.set(token, cours);
        }
        else {
            cours.push(leCours);
        }
    }

    public parseEtudiantFromSgbJSON(json: any): Etudiant {
        return new Etudiant(json._id, json._last_name, json._first_name, json._email, json._permanent_code);
    }

    public parseGroupeFromSgbJSON(json: any): GroupeCours {
        return new GroupeCours(json._groupe, json._nb_max_student);
    }

    public parseCoursFromSgbJSON(json: any): Cours {
        let c: Cours = new Cours(json._id, json._titre, json._sigle, json._date_debut, json._date_fin);
        c.getGroupeCours().push(this.parseGroupeFromSgbJSON(json));
        return c;
    }

}