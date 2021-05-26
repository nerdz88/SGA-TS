import fetch = require('node-fetch');
import { AlreadyExistsError } from '../errors/AlreadyExistsError';
import { Cours } from '../model/Cours';
import { SGA } from "../model/SGA";
import { CoursService } from '../service/CoursService';
import {Session} from "inspector";

export class EnseignantControlleur {
    // classe contrôleur GRASP
    private baseUrl: string = "http://127.0.0.1:3001";
    private endPoint: string = "/api/v1/";
    private sga: SGA;
    //private sgbService: SGBService;
    private coursService: CoursService;

    constructor() {
        this.sga = new SGA();
        // this.sgbService = new SGBService();
        this.coursService = new CoursService();
    }
    public async recupererCoursSGB(tokenEnseignant: string) {
        const reponse = await fetch(this.baseUrl + this.endPoint + "courses", { headers: { token: tokenEnseignant } })
        const json = await reponse.json();
        return json;
    }

    public async recupererEtudiantsCoursSGB(tokenEnseignant: string, id: string) {
        const path = "course/" + id + "/students"
        const reponse = await fetch(this.baseUrl + this.endPoint + path, { headers: { token: tokenEnseignant } })
        const json = await reponse.json()
        return json;
    }

    public async ajouterCours(tokenEnseignant: string, idCours: string) : Promise<void> {
        //On get nos cours
        if (this.coursService.coursExiste(tokenEnseignant, idCours)) {
            throw new AlreadyExistsError("Le cours '" + idCours + "' existe déjà.");
        }
        let reponseCours = this.recupererCoursSGB(tokenEnseignant);
        let self = this;
        reponseCours.then(function (repCours) {
            //On cherche le cours courant
            let coursCourant;
            repCours.data.forEach(element => {
                if (element._id == idCours)
                    coursCourant = element;
            });
            //TODO gestion si le cours existe deja, alors on ajoute un nouveau groupe, Si le groupe existe deja en throw
            let cours: Cours = self.coursService.parseCoursFromSgbJSON(coursCourant);

            //On get la liste des étudiants
            let etudiants = self.recupererEtudiantsCoursSGB(tokenEnseignant, idCours);           
            etudiants.then(function (repEtudiant) {
                //On ajoute nos étudiants à notre seul groupe
                repEtudiant.data.forEach(element => {
                    cours.getGroupeCours()[0].getEtudiants().push(self.coursService.parseEtudiantFromSgbJSON(element));
                });                      
                
                self.coursService.ajouterCours(tokenEnseignant, cours);
              
            });
        });
    }

    public recupererTousCoursSGA(token: string): Cours[] {
        return this.coursService.recupererTousCours(token);
    }

    public recupererUnCoursSGA(token: string, idCours: string): Cours {
        return this.coursService.recupererUnCours(token, idCours);
    }

    public async login(username: string, password: string) {
        const response = await fetch(this.baseUrl + this.endPoint +
             'login?email='+encodeURIComponent(username)+'&password='+password);
        return await response.json();
    }

}