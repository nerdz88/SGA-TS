import fetch = require('node-fetch');
import { AlreadyExistsError } from '../errors/AlreadyExistsError';
import { Cours } from '../model/Cours';
import { SGA } from "../model/SGA";
import { CoursService } from '../service/CoursService';
import { Session } from "inspector";

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

    public async ajouterCours(tokenEnseignant: string, idCours: string) {
        //On get nos cours
        if (this.coursService.coursExiste(tokenEnseignant, idCours)) {
            throw new AlreadyExistsError("Le cours '" + idCours + "' existe déjà.");
        }
        const reponseCours = await this.recupererCoursSGB(tokenEnseignant);


        let cours: Cours = this.coursService.parseCoursFromSgbJSON(reponseCours.data.find(c => c._id == idCours));

        const reponseEtudiants = await this.recupererEtudiantsCoursSGB(tokenEnseignant, idCours);
        //On ajoute nos étudiants à notre seul groupe  
        reponseEtudiants.data.forEach((etudiant: any) => {
            cours.getGroupeCours()[0].getEtudiants().push(this.coursService.parseEtudiantFromSgbJSON(etudiant));
        });
        //On cherche le cours courant
        this.coursService.ajouterCours(tokenEnseignant, cours);
    }

    public recupererTousCoursSGA(token: string): Cours[] {
        return this.coursService.recupererTousCours(token);
    }

    public recupererUnCoursSGA(token: string, idCours: string): Cours {
        return this.coursService.recupererUnCours(token, idCours);
    }

    public async login(username: string, password: string) {
        const response = await fetch(this.baseUrl + this.endPoint +
            'login?email=' + encodeURIComponent(username) + '&password=' + password);
        return await response.json();
    }

}