import { Router, Request, Response, NextFunction, response } from 'express';
import { EnseignantControlleur } from '../core/controllers/EnseignantControlleur';
import { TYPES } from "../core/service/Operation"
import { NotFoundError } from '../core/errors/NotFoundError';
import { SGBService } from '../core/service/SGBService';
import { AuthorizationHelper } from '../core/helper/AuthorizationHelper';
import { Cours } from '../core/model/Cours';

//Le routeur permettant de gérer les routes pour notre site web (Render des Vues)
export class WebAppRouteur {
    router: Router
    enseignantControleur: EnseignantControlleur;  // contrôleur GRASP

    /**
     * Initialize the Router
     */
    constructor(enseignantControleur: EnseignantControlleur) {
        this.enseignantControleur = enseignantControleur;  // init contrôleur GRASP
        this.router = Router();
        this.init();
    }

    //#region Home and Loding

    /**
     * Methode GET pour afficher la page d'accueil : "/"
     * @param req 
     * @param res 
     * @param next 
     */
    public recupererAccueil(req: Request, res: Response, next: NextFunction) {
        if (!AuthorizationHelper.isLoggedIn(req)) {
            res.redirect("/login");
            return;
        }
        res.render("enseignant/accueil", { user: AuthorizationHelper.getCurrentUserInfo(req) });
    }

    /**
     * Methode GET pour afficher la page de login: "/login"
     * @param req 
     * @param res 
     * @param next 
     */
    public recupererLogin(req: Request, res: Response, next: NextFunction) {
        if (!AuthorizationHelper.isLoggedIn(req)) {
            res.render("login");
            return;
        }
        res.redirect("/");
    }

    //#endregion Home and Login

    //#region Gestion Cours

    /**
     * Methode GET qui affiche la page pour ajouter le cours (Selection du cours groupe SGB)
     * @param req 
     * @param res 
     * @param next 
     */
    public recupererAjouterCours(req: Request, res: Response, next: NextFunction) {
        if (!AuthorizationHelper.isLoggedIn(req)) {
            res.redirect("/login");
            return;
        }
        let self = this;
        SGBService.recupererJsonCours({ token: AuthorizationHelper.getCurrentToken(req) })
            .then(reponse => res.render("enseignant/cours/liste-cours-sgb", { cours: reponse.data }))
            .catch(error => self._errorCode500(error, req, res));
    }


    /**
     * Méthode GET qui affiche la liste des cours de l'enseignant
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    public recupererCours(req: Request, res: Response, next: NextFunction) {
        if (!AuthorizationHelper.isLoggedIn(req)) {
            res.redirect("/login");
            return;
        }
        try {
            let value = this.enseignantControleur.recupererElement(TYPES.COURS);
            res.render("enseignant/cours/liste-cours-sga", { cours: JSON.parse(value) });
        } catch (error) { this._errorCode500(error, req, res); }
    }


    /**
     * Methode GET qui affiche les details d'un cours
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    public recupererDetailCours(req: Request, res: Response, next: NextFunction) {
        if (!AuthorizationHelper.isLoggedIn(req)) {
            res.redirect("/login");
            return;
        }
        try {
            let sigleCours = req.params.sigle;
            let idCoursGroupe: number = Number.parseInt(req.params.idCoursGroupe);
            let coursValue = this.enseignantControleur.recupererElementById(TYPES.COURS, sigleCours);
            let cours = JSON.parse(coursValue);
            res.render("enseignant/cours/detail-cours", { cours: cours, groupe: cours.groupeCours.find(cg => cg._id == idCoursGroupe) });
        } catch (error) { this._errorCode500(error, req, res); }
    }

    //#endregion Gestion Cours

    //#region Gestion Questions


    /**
     * Methode GET qui affiche la page de liste de questions 
     * @param req 
     * @param res 
     * @param next 
     */
    public recupererQuestions(req: Request, res: Response, next: NextFunction) {
        if (!AuthorizationHelper.isLoggedIn(req)) {
            res.redirect("/login");
            return;
        }
        try {
            let idCoursGroupe = req.params.idCoursGroupe;
            //TODO lowkey ce n'est pas la job du routeur de faire le filtre, 
            // mais à cause de notre du abstract Operation, il est diffile d'envoyer des paramns custom en primitif 
            //Il faudrait que le controleur s'occupe du filtre
            let values = this.enseignantControleur.recupererElement(TYPES.QUESTION);
            let questions = JSON.parse(values);
            //On est pas tjrs obligé de faire le filtre
            if (idCoursGroupe != undefined) {
                questions = questions.filter((q: { _idGroupeCours: string; }) => q._idGroupeCours == idCoursGroupe);
            }
            res.render("enseignant/question/liste-question", { questions: questions, idCoursGroupe: idCoursGroupe });
        } catch (error) { this._errorCode500(error, req, res); }
    }

    public recupererQuestionsParId(req: Request, res: Response, next: NextFunction) {
        if (!AuthorizationHelper.isLoggedIn(req)) {
            res.redirect("/login");
            return;
        }
        try {
            let values = this.enseignantControleur.recupererElementById(TYPES.QUESTION, req.params.id);
            res.render("enseignant/question/detail-question", { question: JSON.parse(values) });
        } catch (error) { this._errorCode500(error, req, res); }
    }


    /**
     * Methode GET pour afficher la page d'ajout d'une question
     */
    public recupererAjouterQuestion(req: Request, res: Response, next: NextFunction) {
        if (!AuthorizationHelper.isLoggedIn(req)) {
            res.redirect("/login");
            return;
        }
        try {
            let idCoursGroupe = req.params.idCoursGroupe;
            res.render("enseignant/question/ajouter-modifier-question",
                {
                    idCoursGroupe: idCoursGroupe,
                    question: {},
                    estModifiable: false
                });
        } catch (error) { this._errorCode500(error, req, res); }
    }


    /**
     * Methode GET pour afficher la page de modification d'une question
     */
    public recupererModifierQuestion(req: Request, res: Response, next: NextFunction) {
        if (!AuthorizationHelper.isLoggedIn(req)) {
            res.redirect("/login");
            return;
        }
        let idCoursGroupe = req.params.idCoursGroupe;
        let values = this.enseignantControleur.recupererElementById(TYPES.QUESTION, idCoursGroupe);
        res.render("enseignant/question/ajouter-modifier-question",
            {
                idCoursGroupe: idCoursGroupe,
                question: JSON.parse(values),
                estModifiable: true
            });
    }



    //#endregion Gestion Questions







    private _errorCode500(error: any, req, res: Response<any>) {
        var code = 500;
        if (error.code) {
            (req as any).flash(error.message);
            code = error.code;
        }
        //TODO faire une page d'erreur rapid
        res.status(code).json({ error: error.toString() });
    }


    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        //Accueil
        this.router.get('/', this.recupererAccueil.bind(this));

        //Login
        this.router.get('/login', this.recupererLogin.bind(this));

        //Cours
        this.router.get('/enseignant/cours', this.recupererCours.bind(this));
        this.router.get('/enseignant/cours/ajouter', this.recupererAjouterCours.bind(this)); 
        this.router.get('/enseignant/cours/detail/:sigle/:idCoursGroupe', this.recupererDetailCours.bind(this)); 


        //Questions
        this.router.get('/enseignant/question/', this.recupererQuestions.bind(this));
        this.router.get('/enseignant/question/groupe/:idCoursGroupe', this.recupererQuestions.bind(this));
        this.router.get('/enseignant/question/detail/:id', this.recupererQuestionsParId.bind(this));
        this.router.get('/enseignant/question/groupe/:idCoursGroupe/ajouter', this.recupererAjouterQuestion.bind(this));
        this.router.get('/enseignant/question/groupe/:idCoursGroupe/modifier/:idQuestion', this.recupererModifierQuestion.bind(this));
    }
    
}
