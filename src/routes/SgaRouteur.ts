import { Router, Request, Response, NextFunction, response } from 'express';
import { token } from 'morgan';
import * as flash from 'node-twinkle';

import { EnseignantControlleur } from '../core/controllers/EnseignantControlleur';
import { TYPES } from "../core/service/Operation"
import { InvalidParameterError } from '../core/errors/InvalidParameterError';
import { NotFoundError } from '../core/errors/NotFoundError';


// TODO: rethink the name for this "router" function, since it's not really an Express router (no longer being "use()"ed inside Express)
export class SgaRouteur {
    router: Router;
    controlleur: EnseignantControlleur;  // contrôleur GRASP
    token: string
    /**
     * Initialize the Router
     */
    constructor() {
        this.controlleur = new EnseignantControlleur();  // init contrôleur GRASP
        this.router = Router();
        this.init();
    }

    /**
     * Methode GET pour afficher la page d'accueil
     */
    public accueilPage(req: Request, res: Response, next: NextFunction) {
        //TODO - login - afficher le nom de l'utilisateur dans accueil.pug
        if (!req.session.loggedIn) {
            res.redirect("/login");
        }
        else {
            this.token = (req.headers.token ? req.headers.token : req.session.token) as string
            res.render("enseignant/accueil");
        }
    }

    /**
     * Methode GET pour afficher la page de login
     */
    public loginPage(req: Request, res: Response, next: NextFunction) {
        if (req.session.loggedIn) {
            res.redirect("/");
        }
        else {
            res.render('login', { title: 'Service Gestion des Apprentissages' });
        }
    }

    /**
     * Methode qui permet de login
     */
    public login(req: Request, res: Response, next: NextFunction) {
        let email = req.body.email as string;
        let password = req.body.password as string;

        let reponse = this.controlleur.login(email, password);
        console.log("post login")
        reponse.then(response => {
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
                res.redirect("/");
            } else {
                req.session.loggedIn = false;
                (req as any).flash('Unauthorized');
                res.status(400);
                res.redirect("/login");
            }
        });
    }

    public pageAccueil2(req: Request, res: Response, next: NextFunction) {
        if (!req.session.loggedIn) {
            res.sendStatus(401);
            return
        }
        res.render("enseignant/accueil2")
    }

    public pageAjouterCours(req: Request, res: Response, next: NextFunction) {
        if (!req.session.loggedIn) {
            res.sendStatus(401);
            return;
        }
        let params = {
            token: this.token,
            type: TYPES.COURS,
            typeJson: "cours"
        }
        let reponse = this.controlleur.recupererElementSGB(params);
        reponse.then(function (reponse) {
            //TODO - login - afficher le nom de l'utilisateur dans liste-cours.pug 
            res.render("enseignant/liste-cours-sgb", { cours: reponse.data });
        });

        /*let reponse = this.controlleur.recupererCoursSGB(tokenEnseignant);
        reponse.then(function (reponse) {
            //TODO - login - afficher le nom de l'utilisateur dans liste-cours.pug 
            res.render("enseignant/liste-cours-sgb", { cours: reponse.data });
        });*/
    }

    /**
     * Methode POST pour creer cours
     */
    public ajouterCours(req: Request, res: Response, next: NextFunction) {
        if (!req.session.loggedIn) {
            res.sendStatus(401);
            return;
        }
        //let tokenEnseignant = (req.headers.token ? req.headers.token : req.session.token) as string

        let coursSGB = JSON.parse(req.body.data) as any;
        console.log("=============");
        console.log(coursSGB);

        let self = this;
        let params = {
            type: TYPES.COURS,
            cours: coursSGB,
            token: this.token
        }

        self.controlleur.ajouterElement(params)
            .then(() => res.redirect("/enseignant/cours/detail/" + coursSGB._sigle + "/" + coursSGB._id))
            .catch(error => {
                self._errorCode500(error, req, res);
            });
    }

    /**
     * Methode creer cours
     */

    public recupererCours(req: Request, res: Response, next: NextFunction) {
        if (!req.session.loggedIn) {
            res.sendStatus(401);
            return;
        }
        //let tokenEnseignant = (req.headers.token ? req.headers.token : req.session.token) as string
        //res.render("enseignant/liste-cours-sga", { cours: this.controlleur.recupererTousCoursSGA(tokenEnseignant) });


        //params du frontend normalement... X(
        let params = {
            type: TYPES.COURS,
        }
        console.log("===>")
        let value = this.controlleur.recupererElement(params);
        res.render("enseignant/liste-cours-sga", { cours: value  })
    }

    /**
     * Methode qui retourne les details d'un cours
     */
    public recupererDetailCours(req: Request, res: Response, next: NextFunction) {

        if (!this.isLoggedIn) {
            return res.sendStatus(401);
        }

        //TODO remove le token hardcodé apres le login
        //let tokenEnseignant = (req.headers.token ? req.headers.token : req.session.token) as string

        let sigleCours = req.params.sigle;
        let idCoursGroupe = req.params.idCoursGroupe;
        let params = {
            type: TYPES.COURS,
            id: sigleCours
        }
        let cours = this.controlleur.recupererElementById(params);
        res.render("enseignant/detail-cours", { cours: cours, groupe: cours.getGroupeCoursById(idCoursGroupe) });
        //res.render("enseignant/detail-cours", { cours: this.controlleur.recupererUnCoursSGA(this.token, sigleCours) });
    }

    public supprimerCours(req: Request, res: Response, next: NextFunction) {
        if (!this.isLoggedIn) {
            return res.sendStatus(401);
        }

        let sigleCours = req.params.sigle;
        let idCoursGroupe = req.params.idCoursGroupe;
        let params = {
            type: TYPES.COURS,
            sigle: sigleCours,
            idGroupe: idCoursGroupe
        }
        
        if (this.controlleur.supprimerElement(params)) {
            res.status(200)
                .send({
                    message: 'Success',
                    status: res.status
                });
        } else {
            this._errorCode500(new NotFoundError("Le cours n'a pas été supprimé"), req, res);
        }
    }

    public recupererQuestions(req: Request, res: Response, next: NextFunction) {
        if (!this.isLoggedIn) {
            return res.sendStatus(401);
        }
        let params = {
            type: TYPES.QUESTION,
        }

        let questions = this.controlleur.recupererElement(params);
        res.render("enseignant/question/liste-question", { questions: questions, })
    }

    public recupererQuestionsParId(req: Request, res: Response, next: NextFunction) {
        if (!this.isLoggedIn) {
            return res.sendStatus(401);
        }

        let idQuestion = req.params.id;
        let params = {
            type: TYPES.QUESTION,
            id: idQuestion
        }
        let question = this.controlleur.recupererElementById(params);
        res.render("enseignant/question/detail-question", { question: question });
    }


    /**
     * Methode GET pour afficher toutes les questions d'un prof
     */
    public pageAjouterQuestion(req: Request, res: Response, next: NextFunction) {
        if (!this.isLoggedIn) {
            return res.sendStatus(401);
        }
        let params = {
            type: TYPES.COURS,
        }
        let groupeCours = this.controlleur.recupererElement({ type: TYPES.COURS });

        res.render("enseignant/question/ajouter-question", { cours: groupeCours });
    }


    public ajouterQuestion(req: Request, res: Response, next: NextFunction) {
        if (!this.isLoggedIn) {
            return res.sendStatus(401);
        }
        let self = this;
        let params = {
            type: TYPES.QUESTION,
            question: req.body
        }
        this.controlleur.ajouterElement(params)
            .then(() => {
                res.status(200)
                    .send({
                        message: 'Success',
                        status: res.status
                    });
            })
            .catch(error => {
                self._errorCode500(error, req, res);
            });
    }

    public supprimerQuestion(req: Request, res: Response, next: NextFunction) {
        if (!this.isLoggedIn) {
            return res.sendStatus(401);
        }

        let idQuestion = req.params.id;
        let params = {
            type: TYPES.QUESTION,
            id: idQuestion
        }

        if (this.controlleur.supprimerElement(params)) {
            res.status(200)
                .send({
                    message: 'Success',
                    status: res.status
                });
        } else {
            this._errorCode500(new NotFoundError("La question n'a pas été supprimé"), req, res);
        }

    }

    public modifierQuestion(req: Request, res: Response, next: NextFunction) {
        if (!this.isLoggedIn) {
            return res.sendStatus(401);
        }
        let idQuestion = req.params.id;
        let params = {
            type: TYPES.QUESTION,
            id: idQuestion
        }
        let question = this.controlleur.updateElement(params);
        //TODO création du front-End **Lionel
    }

    public isLoggedIn(req) {
        // IF the session variable loggedIn is not found, then we return a 401 response
        // TODO Add an unauthorized page instead of simply returning a 401
        if (!req.session.loggedIn) {
            return false;
        }
        return true;
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

        //Accueil
        this.router.get('/', this.accueilPage.bind(this));

        //Login
        this.router.get('/login', this.loginPage.bind(this));
        this.router.post('/login', this.login.bind(this));

        //Cours
        this.router.get('/enseignant/cours', this.recupererCours.bind(this));
        this.router.get('/enseignant/cours/ajouter', this.pageAjouterCours.bind(this)); //La page pour ajouter un cours 
        this.router.post('/enseignant/cours/ajouter', this.ajouterCours.bind(this)); //Le post ajouter un cours 
        this.router.get('/enseignant/cours/detail/:sigle/:idCoursGroupe', this.recupererDetailCours.bind(this)); // Détail d'un cours
        this.router.get('/enseignant/cours/supprimer/:sigle/:idCoursGroupe', this.supprimerCours.bind(this));


        //Question
        this.router.get('/enseignant/question/', this.recupererQuestions.bind(this));
        this.router.get('/enseignant/question/ajouter', this.pageAjouterQuestion.bind(this));
        this.router.post('/enseignant/question/ajouter', this.ajouterQuestion.bind(this));
        this.router.get('/enseignant/question/detail/:id', this.recupererQuestionsParId.bind(this));
        this.router.get('/enseignant/question/modification/:id', this.modifierQuestion.bind(this));
        this.router.get('/enseignant/question/supprimer/:id', this.supprimerQuestion.bind(this));
        //Cours
        /*
        **this.router.get('/enseignant/cours', this.recupererCours.bind(this)); // Détail d'un cours
        **this.router.get('/enseignant/cours/detail/:sigle', this.recupererDetailCours.bind(this)); // Détail d'un cours
        **this.router.get('/enseignant/cours/ajouter', this.pageAjouterCours.bind(this)); //La page pour ajouter un cours 
        **this.router.post('/enseignant/cours/ajouter', this.ajouterCours.bind(this)); //Le post ajouter un cours 
        */
        // this.router.get('/enseignant/cours', this.recupererCours.bind(this));
        // this.router.get('/enseignant/cours/ajouter', this.pageAjouterCours.bind(this));
        // this.router.get('/enseignant/cours/ajouter/:id', this.ajouterCours.bind(this));
        // this.router.get('/enseignant/cours/:id/detail', this.recupererDetailCours.bind(this));
        // this.router.get('/login/', this.login.bind(this))
    }
}

// exporter its configured Express.Router
export const SgaRoutes = new SgaRouteur();
SgaRoutes.init();
