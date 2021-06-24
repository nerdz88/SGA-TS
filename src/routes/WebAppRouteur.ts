import { NextFunction, Request, Response, Router } from 'express';
import { getDefaultSettings } from 'http2';
import { GestionnaireCours } from '../core/controllers/GestionnaireCours';
import { GestionnaireQuestion } from '../core/controllers/GestionnaireQuestion';
import { AuthorizationHelper } from '../core/helper/AuthorizationHelper';

//Le routeur permettant de gérer les routes pour notre site web (Render des Vues)
export class WebAppRouteur {
    router: Router
    // contrôleur GRASP
    private gestionnaireCours: GestionnaireCours;
    private gestionnaireQuestion: GestionnaireQuestion;
    /**
     * Initialize the Router
     */
    constructor(gestionnaireCours: GestionnaireCours, gestionnaireQuestion: GestionnaireQuestion) {
        this.gestionnaireCours = gestionnaireCours;
        this.gestionnaireQuestion = gestionnaireQuestion;

        this.router = Router();
        this.init();
    }


    //#region Home and Login

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
    public recupererAjouterEspaceCours(req: Request, res: Response, next: NextFunction) {
        if (!AuthorizationHelper.isLoggedIn(req)) {
            res.redirect("/login");
            return;
        }
        let self = this;
        this.gestionnaireCours.recupererGroupesCours(AuthorizationHelper.getCurrentToken(req))
            .then(reponse => res.render("enseignant/cours/liste-cours-sgb", { cours: reponse }))
            .catch(error => self._errorCode500(error, req, res));
    }


    /**
     * Méthode GET qui affiche la liste des cours de l'enseignant
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    public recupererTousEspaceCours(req: Request, res: Response, next: NextFunction) {
        if (!AuthorizationHelper.isLoggedIn(req)) {
            res.redirect("/login");
            return;
        }
        try {
            let value = this.gestionnaireCours.recupererTousEspaceCours(AuthorizationHelper.getIdUser(req));
            res.render("enseignant/cours/liste-cours-sga", { espaceCours: JSON.parse(value) });
        } catch (error) { this._errorCode500(error, req, res); }
    }

    public verifierSGBCoursDisponibilite(req: Request, res: Response, next: NextFunction) {
        let idSGB = parseInt(req.params.id);
        let disponible;
        try {
            disponible = this.gestionnaireCours.recupererUnEspaceCours(idSGB) == undefined;
        } catch (error) {
            disponible = true;
        } finally {
            res.status(200)
                .send({
                    message: 'Success',
                    status: res.status,
                    estDisponible: disponible
                });
        }
        return true;
    }

    /**
     * Methode GET qui affiche les details d'un cours
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    public recupererUnEspaceCours(req: Request, res: Response, next: NextFunction) {
        if (!AuthorizationHelper.isLoggedIn(req)) {
            res.redirect("/login");
            return;
        }
        try {
            let id: number = parseInt(req.params.id);
            let coursValue = this.gestionnaireCours.recupererUnEspaceCours(id);
            let cours = JSON.parse(coursValue);
            if (parseInt(cours._enseignantId) != AuthorizationHelper.getIdUser(req)) {
                res.redirect("/")
                return
            }
            res.render("enseignant/cours/detail-cours", { espaceCours: cours });
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
    public recupererToutesQuestions(req: Request, res: Response, next: NextFunction) {
        if (!AuthorizationHelper.isLoggedIn(req)) {
            res.redirect("/login");
            return;
        }
        try {
            let espaceCours = "{}";
            let arrayQuestion: string;

            if (req.params.id == undefined) {
                arrayQuestion = this.gestionnaireQuestion.recupererToutesQuestions(AuthorizationHelper.getIdUser(req));
            } else {
                let id = parseInt(req.params.id);
                arrayQuestion = this.gestionnaireQuestion.recupererToutesQuestionsEspaceCours(id);
                espaceCours = this.gestionnaireCours.recupererUnEspaceCours(id);
            }
            res.render("enseignant/question/liste-question", { questions: JSON.parse(arrayQuestion), espaceCours: JSON.parse(espaceCours) });
        } catch (error) { this._errorCode500(error, req, res); }
    }

    public recupererUneQuestion(req: Request, res: Response, next: NextFunction) {
        if (!AuthorizationHelper.isLoggedIn(req)) {
            res.redirect("/login");
            return;
        }
        try {
            let idEspaceCours = parseInt(req.params.idEspaceCours);
            let idQuestion = parseInt(req.params.idQuestion);
            let question = this.gestionnaireQuestion.recupererUneQuestion(idEspaceCours, idQuestion);
            res.render("enseignant/question/detail-question", { question: JSON.parse(question) });
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
            let id = req.params.id;
            res.render("enseignant/question/ajouter-modifier-question",
                {
                    idEspaceCours: id,
                    question: {},
                    estModification: false
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
        let idEspaceCours = parseInt(req.params.idEspaceCours);
        let idQuestion = parseInt(req.params.idQuestion);
        let question = this.gestionnaireQuestion.recupererUneQuestion(idEspaceCours, idQuestion);
        res.render("enseignant/question/ajouter-modifier-question",
            {
                idEspaceCours: idEspaceCours,
                question: JSON.parse(question),
                estModification: true
            });
    }

    //#endregion Gestion Questions


    //#region Gestion Devoirs

    public recupererTousDevoirsEspaceCours(req: Request, res: Response, next: NextFunction) {
        // if (!AuthorizationHelper.isLoggedIn(req)) {
        //     res.redirect("/login");
        //     return;
        // }
        try {

            let listeDevoir = [
                {
                    _id: 1,
                    _idEspaceCours: 1,
                    _nom: "Devoir 1",
                    _description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ut tortor at ex ullamcorper posuere eget id ligula",
                    _noteMaximale: 20,
                    _dateDebut: new Date(2021, 6, 24, 10, 0, 0),
                    _dateFin: new Date(2021, 7, 10, 10, 0, 0),
                    _visible: true
                },
                {
                    _id: 2,
                    _idEspaceCours: 1,
                    _nom: "Devoir 2",
                    _description: "Consectetur adipiscing elit. Morbi ut tortor at ex ullamcorper posuere eget id ligula.Lorem ipsum dolor sit amet. ",
                    _noteMaximale: 15,
                    _dateDebut: new Date(2021, 6, 25, 11, 0, 0),
                    _dateFin: new Date(2021, 7, 15, 12, 40, 0),
                    _visible: false
                },
                {
                    _id: 3,
                    _idEspaceCours: 1,
                    _nom: "Devoir 3",
                    _description: "Consectetur adipiscing elit. Morbi ut tortor at ex ullamcorper posuere eget id ligula.Lorem ipsum dolor sit amet. ",
                    _noteMaximale: 45,
                    _dateDebut: new Date(2021, 6, 10, 9, 0, 0),
                    _dateFin: new Date(2021, 6, 25, 12, 40, 0),
                    _visible: true
                },
            ]
            res.render("enseignant/devoir/liste-devoir", { devoirs: listeDevoir, espaceCours: {} });

        } catch (error) { this._errorCode500(error, req, res); }
    }

    public recupererUnDevoirs(req: Request, res: Response, next: NextFunction) {
        // if (!AuthorizationHelper.isLoggedIn(req)) {
        //     res.redirect("/login");
        //     return;
        // }
        try {

            let devoir1 = {
                _id: 1,
                _idEspaceCours: 1,
                _nom: "Devoir 1",
                _description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ut tortor at ex ullamcorper posuere eget id ligula",
                _noteMaximale: 20,
                _dateDebut: new Date(2021, 6, 24, 10, 0, 0),
                _dateFin: new Date(2021, 7, 10, 10, 0, 0),
                _visible: true,
                _remises: [
                    {
                        _id: 1,
                        _idEtudiant: 1,
                        _etat: "NonRemis"
                    },
                    {
                        _id: 1,
                        _idEtudiant: 2,
                        _dateRemise: new Date(2021, 6, 24, 12, 0, 0),
                        _etat: "Remis"
                    },
                    {
                        _id: 2,
                        _idEtudiant: 3,
                        _dateRemise: new Date(2021, 6, 24, 12, 0, 0),
                        _dateCorrection: new Date(2021, 6, 24, 13, 0, 0),
                        _note: 18,
                        _etat: "RemisCorriger"
                    }
                ]
            };

            res.render("enseignant/devoir/detail-devoir", { devoir: devoir1 });

        } catch (error) { this._errorCode500(error, req, res); }
    }


    public recupererAjouterDevoir(req: Request, res: Response, next: NextFunction) {
        // if (!AuthorizationHelper.isLoggedIn(req)) {
        //     res.redirect("/login");
        //     return;
        // }


        res.render("enseignant/devoir/ajouter-modifier-devoir",
            {
                idEspaceCours: 1,
                devoir: {},
                estModification: false
            });
    }


    public recupererModifierDevoir(req: Request, res: Response, next: NextFunction) {
        // if (!AuthorizationHelper.isLoggedIn(req)) {
        //     res.redirect("/login");
        //     return;
        // }
        let devoir1 = {
            _id: 1,
            _idEspaceCours: 1,
            _nom: "Devoir 1",
            _description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ut tortor at ex ullamcorper posuere eget id ligula",
            _noteMaximale: 20,
            _dateDebut: new Date(2021, 6, 24, 10, 0, 0),
            _dateFin: new Date(2021, 7, 10, 10, 0, 0),
            _visible: true,
        };

        res.render("enseignant/devoir/ajouter-modifier-devoir",
            {
                idEspaceCours: devoir1._idEspaceCours,
                devoir: devoir1,
                estModification: true
            });
    }


    //#endregion Gestion Devoirs


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
        this.router.get('/enseignant/cours', this.recupererTousEspaceCours.bind(this));
        this.router.get('/enseignant/cours/ajouter', this.recupererAjouterEspaceCours.bind(this));
        this.router.get('/enseignant/cours/detail/:id', this.recupererUnEspaceCours.bind(this));
        this.router.get('/enseignant/cours/verifierDispo/:id', this.verifierSGBCoursDisponibilite.bind(this))

        //Questions
        this.router.get('/enseignant/question/', this.recupererToutesQuestions.bind(this));
        this.router.get('/enseignant/question/:id', this.recupererToutesQuestions.bind(this));
        this.router.get('/enseignant/question/detail/:idEspaceCours/:idQuestion', this.recupererUneQuestion.bind(this));
        this.router.get('/enseignant/question/ajouter/:id', this.recupererAjouterQuestion.bind(this));
        this.router.get('/enseignant/question/modifier/:idEspaceCours/:idQuestion', this.recupererModifierQuestion.bind(this));

        //Devoirs
        this.router.get('/enseignant/devoir/:id', this.recupererTousDevoirsEspaceCours.bind(this));
        this.router.get('/enseignant/devoir/detail/:idEspaceCours/:idDevoir', this.recupererUnDevoirs.bind(this));

        this.router.get('/enseignant/devoir/ajouter/:id', this.recupererAjouterDevoir.bind(this));
        this.router.get('/enseignant/devoir/modifier/:idEspaceCours/:idDevoir', this.recupererModifierDevoir.bind(this));

    }

}
