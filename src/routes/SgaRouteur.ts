import {Router, Request, Response, NextFunction, response} from 'express';
import {token} from 'morgan';
import * as flash from 'node-twinkle';

import {EnseignantControlleur} from '../core/controllers/EnseignantControlleur';
import {InvalidParameterError} from '../core/errors/InvalidParameterError';

// TODO: rethink the name for this "router" function, since it's not really an Express router (no longer being "use()"ed inside Express)
export class SgaRouteur {
    router: Router;
    controlleur: EnseignantControlleur;  // contrôleur GRASP

    /**
     * Initialize the Router
     */
    constructor() {
        this.controlleur = new EnseignantControlleur();  // init contrôleur GRASP
        this.router = Router();
        this.init();
    }

    /**
     * Methode creer cours
     */

    public recupererCours(req: Request, res: Response, next: NextFunction) {
        //TODO remove le token hardcodé apres le login
        // IF the session variable loggedIn is not found, then we return a 401 response
        // TODO Add an unauthorized page instead of simply returning a 401
        console.log("This is the loggedIn session thing : " + req.session.loggedIn);
        if (!req.session.loggedIn) {
            res.send(401);
            return;
        }

        let tokenEnseignant = (req.headers.token ? req.headers.token : req.session.token) as string
        let reponse = this.controlleur.recupererCours(tokenEnseignant);
        reponse.then(function (reponse) {
            //TODO - login - afficher le nom de l'utilisateur dans liste-cours.pug
            res.render("enseignant/liste-cours", {cours: reponse.data});
        });
    }

    /**
     * Methode qui retourne les details d'un cours
     */
    public recupererDetailCours(req: Request, res: Response, next: NextFunction) {

      // IF the session variable loggedIn is not found, then we return a 401 response
      // TODO Add an unauthorized page instead of simply returning a 401
        if (!req.session.loggedIn) {
            res.send(401);
            return;
        }

        //TODO remove le token hardcodé apres le login
        let tokenEnseignant = (req.headers.token ? req.headers.token : req.session.token) as string
        let idCours = req.params.id;
        let self = this;

        //On get nos cours
        let reponseCours = self.controlleur.recupererCours(tokenEnseignant);
        reponseCours.then(function (repCours) {
            //On cherche le cours courant
            let coursCourant;
            repCours.data.forEach(element => {
                if (element._id == idCours)
                    coursCourant = element;
            });

            //On get la liste des
            let reponseDetail = self.controlleur.recupererDetailCours(tokenEnseignant, idCours);
            reponseDetail.then(function (repDetail) {
                //Render la view!
                res.render("enseignant/detail-cours", {cours: coursCourant, etudiants: repDetail.data});
            });
        });
    }

    /**
     * Methode qui permet de login
     */
    public login(req: Request, res: Response, next: NextFunction) {
        let email = req.query.email as string;
        let password = req.query.password as string;
        console.log(email);
        console.log(password);
        let reponse = this.controlleur.login(email, password);
        reponse.then(response => {
            console.log(response);
            if ("message" in response && response["message"] == "Success") {
                let token = response["token"];
                req.session.email = email;
                req.session.loggedIn = true;
                req.session.token = token;
                // Cookies not working, i have to add the cookie-parser to the App.ts middleware method, for now let's
                // just store the token in the session
                //res.cookie("token", token);
                (req as any).flash('Requete details des etudiants dans un cour');
                res.status(200);
                // Je sais pas ou redirect pour le moment
                res.redirect("/");
            } else {
                req.session.loggedIn = false;
                (req as any).flash('Unauthorized');
                res.status(400);
                // Je sais pas ou redirect pour le moment
                res.redirect("/");
            }
        });
    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        this.router.get('/enseignant/cours',
            this.recupererCours.bind(this));
        this.router.get('/enseignant/cours/:id/detail', this.recupererDetailCours.bind(this));
        this.router.get('/login/', this.login.bind(this))
    }
}

// exporter its configured Express.Router
export const SgaRoutes = new SgaRouteur();
SgaRoutes.init();
