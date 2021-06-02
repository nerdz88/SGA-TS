import { NotFoundError } from "../errors/NotFoundError";
import { AlreadyExistsError } from "../errors/AlreadyExistsError";
import fetch = require('node-fetch');
import { Application, Request, Response } from 'express'
import { Cours } from "../model/Cours";
import { GroupeCours } from "../model/GroupeCours";
import { Etudiant } from "../model/Etudiant";
import { stringify } from "querystring";


//Classe de service pour les Cours: Get,Add,Set,Delete
//Représente notre Catalogue de Cours
export class CoursService {

    //Map<Token Map<SigleCours, Cours>>
    //Map de map => Cause des problèmes, il faudrait avoir une methode init pour chaque prof pour avoir des Map vide mais pas null
    private _coursSelonEnseignant: Map<string, Map<string, Cours>>;
    constructor() {
        this._coursSelonEnseignant = new Map<string, Map<string, Cours>>();
    }

    //On retroune les cours d'un prof sinon une liste vide!
    public recupererTousCours(token: string): Cours[] {

        let map = this._coursSelonEnseignant.get(token)
        console.log("recupererTousCours");
        console.log(map);
        if (map == undefined)
            return [];
        let cours: Cours[];
        for (let c of map.values()) {
            cours.push(c);
        }
        return cours;
    }

    public recupererUnCours(token: string, sigle: string): Cours {
        console.log("recupererUnCours");
        console.log(this.recupererTousCours(token));
        let leCours: Cours = this.recupererTousCours(token).find(c => c.getSigle() == sigle);
        if (leCours == undefined) {
            throw new NotFoundError("Le cours '" + sigle + "' n'existe pas.");
        }
        return leCours;
    }

    public coursExiste(token: string, sigle: string): boolean {
        console.log("coursExiste");
        console.log(this.recupererTousCours(token));
        return this.recupererTousCours(token).find(c => c.getSigle() == sigle) != undefined;
    }

    public groupeCoursExiste(token: string, sigle: string, idGroupeCours: number): boolean {

        if (!this.coursExiste(token, sigle)) {
            return false;
        }
        return this._coursSelonEnseignant.get(token).get(sigle).getGroupeCoursById(idGroupeCours) != undefined;
    }

    private creerCours(coursSgb: any): Cours {
        let coursSGA = new Cours(coursSgb._sigle, coursSgb._titre, coursSgb._nb_max_student);
        coursSGA.ajoutGroupeCours(this.creerGroupeCours(coursSgb));
        return coursSGA;
    }

    private creerGroupeCours(coursSgb: any): GroupeCours {
        return new GroupeCours(coursSgb._id, coursSgb._groupe, coursSgb.date_debut, coursSgb.date_fin);
    }

    public ajouterCours(token: string, coursSgb: any): Cours {
        if (this._coursSelonEnseignant.get(token) == undefined) {
            this._coursSelonEnseignant.set(token, new Map<string, Cours>());
        }

        if (!this.coursExiste(token, coursSgb._sigle)) {
            let cours = this.creerCours(coursSgb);
            this._coursSelonEnseignant.get(token).set(cours.getSigle(), cours);
            return cours;
        }
        else if (!this.groupeCoursExiste(token, coursSgb._sigle, coursSgb._id)) {
            let groupeCours = this.creerGroupeCours(coursSgb);
            let cours = this._coursSelonEnseignant.get(token).get(coursSgb._sigle)
            cours.ajoutGroupeCours(groupeCours);
            return cours;
        }
        else {
            throw new AlreadyExistsError("Le groupeCours" + coursSgb._sigle + " : " + coursSgb._id + "existe déjà");
        }
    }

    public parseEtudiantFromSgbJSON(json: any): Etudiant {
        return new Etudiant(json._id, json._last_name, json._first_name, json._email, json._permanent_code);
    }

    // public parseGroupeFromSgbJSON(json: any): GroupeCours {
    //     return new GroupeCours(json._groupe, json._nb_max_student);
    // }

    // public parseCoursFromSgbJSON(json: any): Cours {
    //     let c: Cours = new Cours(json._id, json._titre, json._sigle, json._date_debut, json._date_fin);
    //     c.getGroupeCours().push(this.parseGroupeFromSgbJSON(json));
    //     return c;
    // }

}