import fetch = require('node-fetch');
import { AlreadyExistsError } from '../errors/AlreadyExistsError';
import { Cours } from '../model/Cours';
import { SGA } from "../model/SGA";
import { Operation, TYPES } from '../service/Operation';
import { CoursService } from '../service/CoursService';
import { Session } from "inspector";
import { OperationCours } from '../service/OperationCours';

export class EnseignantControlleur {
    // classe contrôleur GRASP
    private baseUrl: string = "http://127.0.0.1:3001";
    private endPoint: string = "/api/v1/";

    private sga: SGA;
    //private sgbService: SGBService;
    //private coursService: CoursService;
    private operations : Map<String,Operation<any>>;

    constructor() {
        this.operations = new Map<String,Operation<any>>();
        this.operations.set(TYPES.COURS,new OperationCours());
        
        // Rajouter les question,questionaires et devoirs à fur et à mesure

        //this.sga = new SGA();
        // this.sgbService = new SGBService();
        //this.coursService = new CoursService();

    }

    public async ajouterElement(params : any){
        let operation = this.getOperationParCle(params.type);
        console.log("----> objet créer")
        operation.creerObjet(params);
    }

    public recupererElement(params : any){
        let operation = this.getOperationParCle(params.type);
        return operation.recupererObjet(params);
    }

    public recupererElementById(params : any){
        let operation =this.getOperationParCle(params.type);
        return operation.recupererObjetParId(params.sigle);
    }

    public supprimerElement(params : any){
    }

    public recupererElementSGB(params : any){
        let operation= this.getOperationParCle(params.type);
        return operation.recupererJsonSGB(params)
    }
    

    private getOperationParCle(cle : string){
        if(this.operations.has(cle)){
            return this.operations.get(cle);
        }
        //throw new exception....
    }




    /*public async recupererCoursSGB(tokenEnseignant: string) {
        const reponse = await fetch(this.baseUrl + this.endPoint + "courses", { headers: { token: tokenEnseignant } })
        const json = await reponse.json();
        return json;
    }*/
/*
    public async recupererEtudiantsCoursSGB(tokenEnseignant: string, id: string) {
        const path = "course/" + id + "/students"
        const reponse = await fetch(this.baseUrl + this.endPoint + path, { headers: { token: tokenEnseignant } })
        const json = await reponse.json()
        return json;
    }

    public async ajouterCours(tokenEnseignant: string, coursSGB: any) {
        //On ajoute notre cours
        let coursSga : Cours =  this.coursService.ajouterCours(tokenEnseignant, coursSGB);
        //On ajoute nos étudiants       
        const reponseEtudiants = await this.recupererEtudiantsCoursSGB(tokenEnseignant, coursSGB._id);
        reponseEtudiants.data.forEach((etudiant: any) => {
            coursSga.getGroupeCours(coursSGB._id).getEtudiants().push(this.coursService.parseEtudiantFromSgbJSON(etudiant));
        });  
    }

    public recupererTousCoursSGA(token: string): Cours[] {
        return this.coursService.recupererTousCours(token);
    }

    public recupererUnCoursSGA(token: string, idCours: string): Cours {
        return this.coursService.recupererUnCours(token, idCours);
    }*/

    public async login(username: string, password: string) {
        const response = await fetch(this.baseUrl + this.endPoint +
            'login?email=' + encodeURIComponent(username) + '&password=' + password);
        return await response.json();
    }

}