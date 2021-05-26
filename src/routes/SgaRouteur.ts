import { Router, Request, Response, NextFunction, response } from 'express';
import { token } from 'morgan';
import * as flash from 'node-twinkle';

import { EnseignantControlleur } from '../core/controllers/EnseignantControlleur';
import { InvalidParameterError } from '../core/errors/InvalidParameterError';


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

    public pageAccueil(req: Request, res: Response, next: NextFunction) {
        //TODO - login - afficher le nom de l'utilisateur dans accueil.pug
        if (!req.session.loggedIn) {
            res.sendStatus(401);
            return;
        }
        res.render("enseignant/accueil");
    }

    public pageAjouterCours(req: Request, res: Response, next: NextFunction) {
        if (!req.session.loggedIn) {
            res.sendStatus(401);
            return;
        }
        let tokenEnseignant = (req.headers.token ? req.headers.token : req.session.token) as string

        let reponse = this.controlleur.recupererCoursSGB(tokenEnseignant);
        reponse.then(function (reponse) {
            //TODO - login - afficher le nom de l'utilisateur dans liste-cours.pug 
            res.render("enseignant/liste-cours-sgb", { cours: reponse.data });
        });
    }

    public ajouterCours(req: Request, res: Response, next: NextFunction) {
        if (!req.session.loggedIn) {
            res.sendStatus(401);
            return;
        }
        let tokenEnseignant = (req.headers.token ? req.headers.token : req.session.token) as string

        let idCours = req.params.id;
        let self = this;

        self.controlleur.ajouterCours(tokenEnseignant, idCours).
            then(function (result) {
                res.redirect("/api/v1/sga/enseignant/cours/" + idCours + "/detail");
            })
            .catch(function (error) {               
                self._errorCode500(error, req, res);
            });
    }

    /**
     * Methode creer cours
     */

    public recupererCours(req: Request, res: Response, next: NextFunction) {
        console.log("This is the loggedIn session thing : " + req.session.loggedIn);
        if (!req.session.loggedIn) {
            res.sendStatus(401);
            return;
        }
        let tokenEnseignant = (req.headers.token ? req.headers.token : req.session.token) as string
        res.render("enseignant/liste-cours-sga", { cours: this.controlleur.recupererTousCoursSGA(tokenEnseignant) });
    }

    /**
     * Methode qui retourne les details d'un cours
     */
    public recupererDetailCours(req: Request, res: Response, next: NextFunction) {

        // IF the session variable loggedIn is not found, then we return a 401 response
        // TODO Add an unauthorized page instead of simply returning a 401
        if (!req.session.loggedIn) {
            res.sendStatus(401);
            return;
        }
        //TODO remove le token hardcodé apres le login
        let tokenEnseignant = (req.headers.token ? req.headers.token : req.session.token) as string

        let idCours = req.params.id;
        res.render("enseignant/detail-cours", { cours: this.controlleur.recupererUnCoursSGA(tokenEnseignant, idCours) });
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
                res.redirect("/api/v1/sga/enseignant/accueil");
            } else {
                req.session.loggedIn = false;
                (req as any).flash('Unauthorized');
                res.status(400);
                res.redirect("/");
            }
        });
    }

    private _errorCode500(error: any, req, res: Response<any>) {
        var code = 500;
        if (error.code) {
            (req as any).flash(error.message);
            code = error.code;
        }
        res.status(code).json({ error: error.toString() });
    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        this.router.get('/enseignant/accueil', this.pageAccueil.bind(this));
        this.router.get('/enseignant/cours', this.recupererCours.bind(this));
        this.router.get('/enseignant/cours/ajouter', this.pageAjouterCours.bind(this));
        this.router.get('/enseignant/cours/ajouter/:id', this.ajouterCours.bind(this));
        this.router.get('/enseignant/cours/:id/detail', this.recupererDetailCours.bind(this));
        this.router.get('/login/', this.login.bind(this))
    }
}

// exporter its configured Express.Router
export const SgaRoutes = new SgaRouteur();
SgaRoutes.init();
