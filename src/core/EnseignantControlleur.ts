import { De } from "./De";
import { Joueur } from "./Joueur";
import { NotFoundError } from "./errors/NotFoundError";
import { AlreadyExistsError } from "./errors/AlreadyExistsError";
import fetch = require('node-fetch');
import { Application, Request, Response } from 'express'

export class EnseignantControlleur {
    // classe contrôleur GRASP

    // map des Joueurs
    private joueurs: Map<string, Joueur>;
    private d1: De;
    private d2: De;
    private baseUrl: string = "http://127.0.0.1:3001";
    private endPoint: string = "/api/v1/";

    constructor() {
        console.log("Initialiser JeuDeDes");
        this.joueurs = new Map<string, Joueur>();
        this.d1 = new De();
        this.d2 = new De();
    }

    /**
     *  opérations systèmes
     */

    public demarrerJeu(nom: string): string {

        if (this.joueurs.get(nom) !== undefined) {
            // joueur existe déjà
            throw new AlreadyExistsError("Joueur '" + nom + "' existe déjà.");
        }

        let joueur = new Joueur(nom);
        this.joueurs.set(nom, joueur);
        return JSON.stringify(joueur);
    }

    brasser(): number {
        this.d1.brasser();
        this.d2.brasser();
        let v1 = this.d1.valeur;
        let v2 = this.d2.valeur;
        let somme = v1 + v2;
        return somme;
    }

    public jouer(nom: string): string {
        let joueur = this.joueurs.get(nom);
        if (joueur === undefined) {
            // joueur n'existe pas
            throw new NotFoundError("Joueur '" + nom + "' n'existe pas.");
        }
        let somme = this.brasser()
        joueur.lancer();
        if (somme == 7) joueur.gagner();
        let resultat = {
            nom: nom,
            somme: somme,
            lancers: joueur.lancers,
            reussites: joueur.lancersGagnes,
            v1: this.d1.valeur,
            v2: this.d2.valeur,
            message: "Vous avez " + (somme == 7 ? "gagné!!!" : "perdu.")
        };
        return JSON.stringify(resultat);
    }

    public terminerJeu(nom: string): string {
        if (this.joueurs.get(nom) === undefined) {
            // joueur n'existe pas
            throw new NotFoundError("Joueur '" + nom + "' n'existe pas.");
        }
        this.joueurs.delete(nom);
        let resultat = {
            nom: nom,
            message: "Merci d'avoir joué."
        };
        return JSON.stringify(resultat);
    }

    // d'autres méthodes
    public getJoueurs() {
        return JSON.stringify(Array.from(this.joueurs.values()));
    }

    public async recupererCours(tokenEnseignant: string) {

        const reponse = await fetch(this.baseUrl + this.endPoint + "courses", { headers: { token: tokenEnseignant } })
        const json = await reponse.json();
        return json;

    }

    public async recupererDetailCour(tokenEnseignant: string, id: string) {

        const path = "course/" + id + "/students"
        const reponse = await fetch(this.baseUrl + this.endPoint + path, { headers: { token: tokenEnseignant } })
        console.log(reponse);
        const json = await reponse.json()
        return json;

    }

    public async login(username: string, password: string) {

        const reponse = await fetch(this.baseUrl + this.endPoint +
             'login?email='+encodeURIComponent(username)+'&password='+password);
        
            
        const json = await reponse.json();
        return json;
    }

}