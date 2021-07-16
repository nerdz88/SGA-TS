import { NextFunction, Request, Response, Router } from 'express';
import { GestionnaireCours } from '../core/controllers/GestionnaireCours';
import { GestionnaireDevoir } from '../core/controllers/GestionnaireDevoir';
import { GestionnaireQuestion } from '../core/controllers/GestionnaireQuestion';
import { GestionnaireQuestionnaire } from '../core/controllers/GestionnaireQuestionnaire';
import { AuthorizationHelper } from '../core/helper/AuthorizationHelper';
import authMiddleware from '../core/middleware/auth.middleware';
import { TypeQuestion } from '../core/model/TypeQuestion';

//Le routeur permettant de gérer les routes pour notre site web (Render des Vues)
export class WebAppRouteur {
    router: Router
    // contrôleur GRASP
    private gestionnaireCours: GestionnaireCours;
    private gestionnaireQuestion: GestionnaireQuestion;
    private gestionnaireDevoir: GestionnaireDevoir;
    private gestionnaireQuestionnaire: GestionnaireQuestionnaire
    /**
     * Initialize the Router
     */
    constructor(gestionnaireCours: GestionnaireCours, gestionnaireDevoir: GestionnaireDevoir, gestionnaireQuestion: GestionnaireQuestion, gestionnaireQuestionnaire: GestionnaireQuestionnaire) {
        this.gestionnaireCours = gestionnaireCours;
        this.gestionnaireQuestionnaire = gestionnaireQuestionnaire;
        this.gestionnaireQuestion = gestionnaireQuestion;
        this.gestionnaireDevoir = gestionnaireDevoir;
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
        let data;
        data = {
            user: AuthorizationHelper.getCurrentUserInfo(req)
        }

        if (AuthorizationHelper.isEtudiant(req)) {
            //TODO get espaceCours d'un étudiant
            let espaceCours = this.gestionnaireCours.recupererTousEspaceCoursEtudiant(AuthorizationHelper.getIdUser(req));
            data.espaceCours = JSON.parse(espaceCours);
        }

        res.render(`${AuthorizationHelper.getPrefixPage(req)}/accueil`, data);
    }


    //#endregion Home and Login

    //#region Enseignant

    //#region Gestion Cours

    /**
     * Methode GET qui affiche la page pour ajouter le cours (Selection du cours groupe SGB)
     * @param req 
     * @param res 
     * @param next 
     */
    public recupererAjouterEspaceCours(req: Request, res: Response, next: NextFunction) {
        this.gestionnaireCours.recupererGroupesCours(AuthorizationHelper.getCurrentToken(req))
            .then(reponse => res.render("enseignant/cours/liste-cours-sgb", { cours: reponse }))
            .catch(next);
    }


    /**
     * Méthode GET qui affiche la liste des cours de l'enseignant
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    public recupererTousEspaceCours(req: Request, res: Response, next: NextFunction) {
        let value = this.gestionnaireCours.recupererTousEspaceCours(AuthorizationHelper.getIdUser(req));
        res.render("enseignant/cours/liste-cours-sga", { espaceCours: JSON.parse(value) });
    }

    /**
     * Methode GET qui affiche les details d'un cours
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    public recupererUnEspaceCours(req: Request, res: Response, next: NextFunction) {
        let id: number = parseInt(req.params.id);
        let cours = JSON.parse(this.gestionnaireCours.recupererUnEspaceCours(id));
        let hasAccess = true;
        if (AuthorizationHelper.isEtudiant(req)) {
            hasAccess = cours._etudiants.find((e: { _id: number; }) => e._id == AuthorizationHelper.getIdUser(req)) != undefined;
        }
        else {
            hasAccess = parseInt(cours._enseignantId) == AuthorizationHelper.getIdUser(req);
        }
        if (!hasAccess) {
            return res.redirect("/");
        }

        res.render(`${AuthorizationHelper.getPrefixPage(req)}/cours/detail-cours`, { espaceCours: cours });
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
    }

    public recupererUneQuestion(req: Request, res: Response, next: NextFunction) {
        let idEspaceCours = parseInt(req.params.idEspaceCours);
        let idQuestion = parseInt(req.params.idQuestion);
        let question = this.gestionnaireQuestion.recupererUneQuestion(idEspaceCours, idQuestion);
        res.render("enseignant/question/detail-question", { question: JSON.parse(question) });
    }


    /**
     * Methode GET pour afficher la page d'ajout d'une question
     */
    public recupererAjouterQuestion(req: Request, res: Response, next: NextFunction) {
        let id = req.params.id;
        let choix = req.params.type;
        var enumChoixType = TypeQuestion[choix]
        console.log(enumChoixType)
        res.render("enseignant/question/" + enumChoixType,
            {
                idEspaceCours: id,
                question: {},
                estModification: false
            });
    }

    public recupererAjouterChoixTypeQuestion(req: Request, res: Response, next: NextFunction) {
        let id = req.params.id;
        res.render("enseignant/question/choix-type-question",
            {
                idEspaceCours: id,
                question: {},
                estModification: false
            });
    }


    /**
     * Methode GET pour afficher la page de modification d'une question
     */
    public recupererModifierQuestion(req: Request, res: Response, next: NextFunction) {
        let idEspaceCours = parseInt(req.params.idEspaceCours);
        let idQuestion = parseInt(req.params.idQuestion);
        let question = this.gestionnaireQuestion.recupererUneQuestion(idEspaceCours, idQuestion);
        res.render("enseignant/question/question-vrai-faux",
            {
                idEspaceCours: idEspaceCours,
                question: JSON.parse(question),
                estModification: true,
                returnUrl: req.headers.referer
            });
    }

    //#endregion Gestion Questions

    //#region Gestion Questionnaires


    public creerQuestionnaires(req: Request, res: Response, next: NextFunction) {
        let id = parseInt(req.params.id);
        res.render("enseignant/questionnaire/ajouter-modifier-questionnaire",
            {
                idEspaceCours: id,
                questionnaire: {},
                estModification: false
            });
    }

    public modifierQuestionnaire(req: Request, res: Response, next: NextFunction) {
        let idEspaceCours = parseInt(req.params.idEspaceCours);
        let idQuestionnaire = parseInt(req.params.idQuestionnaire);
        let questionnaire = this.gestionnaireQuestionnaire.recupererUnQuestionnaire(idEspaceCours, idQuestionnaire);
        res.render("enseignant/questionnaire/ajouter-modifier-questionnaire",
            {
                idEspaceCours: idEspaceCours,
                questionnaire: JSON.parse(questionnaire),
                estModification: true
            });
    }

    public gererQuestionsQuestionnaire(req: Request, res: Response, next: NextFunction) {
        let idEspaceCours = parseInt(req.params.idEspaceCours);
        let idQuestionnaire = parseInt(req.params.idQuestionnaire);

        let currentQuestionsID = this.gestionnaireQuestionnaire.recupererIdsQuestionsQuestionnaire(idEspaceCours, idQuestionnaire);
        let questions = this.gestionnaireQuestion.recupererToutesQuestionsEspaceCours(idEspaceCours);
        let tags = this.gestionnaireQuestionnaire.recupererTagQuestionParEspaceCours(idEspaceCours);

        res.render("enseignant/questionnaire/gerer-question-questionnaire", {
            idEspaceCours: idEspaceCours,
            idQuestionnaire: idQuestionnaire,
            questions: JSON.parse(questions),
            currentQuestionsID: JSON.parse(currentQuestionsID),
            tags: JSON.parse(tags),
            returnUrl: req.headers.referer
        });
    }

    public recupererUnQuestionnaire(req: Request, res: Response, next: NextFunction) {
        let ordreTri: number = parseInt(req.query.o?.toString());
        let idEspaceCours = parseInt(req.params.idEspaceCours);
        let idQuestionnaire = parseInt(req.params.idQuestionnaire);
        let questionnaire = JSON.parse(this.gestionnaireQuestionnaire.recupererUnQuestionnaire(idEspaceCours, idQuestionnaire, ordreTri));
        res.render("enseignant/questionnaire/detail-questionnaire", { questionnaire: questionnaire, currentOrdre: ordreTri });
    }

    public recupererTousQuestionnaires(req: Request, res: Response, next: NextFunction) {
        let arrayQuestionnaire: string;
        let espaceCours = "{}";
        if (req.params.id == undefined) {
            arrayQuestionnaire = this.gestionnaireQuestionnaire.recupererTousQuestionnaires(AuthorizationHelper.getIdUser(req))
        } else {
            let id = parseInt(req.params.id);
            arrayQuestionnaire = this.gestionnaireQuestionnaire.recupererTousQuestionnairesEspaceCours(id);
            espaceCours = this.gestionnaireCours.recupererUnEspaceCours(id);
        }
        res.render("enseignant/questionnaire/liste-questionnaires", { questionnaires: JSON.parse(arrayQuestionnaire), espaceCours: JSON.parse(espaceCours) });
    }

    //#endregion Gestion Questionnaires

    //#region Gestion Devoirs

    public recupererTousDevoirsEspaceCours(req: Request, res: Response, next: NextFunction) {
        let id = parseInt(req.params.id);
        let espaceCours = this.gestionnaireCours.recupererUnEspaceCours(id);
        let arrayDevoirs = this.gestionnaireDevoir.recupererTousDevoirsEspaceCours(id);
        res.render("enseignant/devoir/liste-devoir", { devoirs: JSON.parse(arrayDevoirs), espaceCours: JSON.parse(espaceCours) });

    }

    public recupererUnDevoir(req: Request, res: Response, next: NextFunction) {
        let ordreTri: number = parseInt(req.query.o?.toString());
        let idEspaceCours = parseInt(req.params.idEspaceCours);
        let idDevoir = parseInt(req.params.idDevoir);
        let devoir = this.gestionnaireDevoir.recupererUnDevoir(idEspaceCours, idDevoir, ordreTri);
        res.render("enseignant/devoir/detail-devoir", { devoir: JSON.parse(devoir), currentOrdre: ordreTri });
    }


    public recupererAjouterDevoir(req: Request, res: Response, next: NextFunction) {
        let id = parseInt(req.params.id);
        res.render("enseignant/devoir/ajouter-modifier-devoir",
            {
                idEspaceCours: id,
                devoir: {},
                estModification: false
            });
    }


    public recupererModifierDevoir(req: Request, res: Response, next: NextFunction) {
        let idEspaceCours = parseInt(req.params.idEspaceCours);
        let idDevoir = parseInt(req.params.idDevoir);
        let devoir = this.gestionnaireDevoir.recupererUnDevoir(idEspaceCours, idDevoir);

        res.render("enseignant/devoir/ajouter-modifier-devoir",
            {
                idEspaceCours: idEspaceCours,
                devoir: JSON.parse(devoir),
                estModification: true
            });
    }


    //#endregion Gestion Devoirs

    //#endregion Enseignant



    //#region Étudiant 





    //#endregion Étudiant



    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        //Indique qu'on veut être login
        this.router.use(authMiddleware);

        //Accueil
        this.router.get('/', this.recupererAccueil.bind(this));


        //#region Routes Enseignant

        //Cours
        this.router.get('/enseignant/cours', this.recupererTousEspaceCours.bind(this));
        this.router.get('/enseignant/cours/ajouter', this.recupererAjouterEspaceCours.bind(this));
        this.router.get('/enseignant/cours/detail/:id', this.recupererUnEspaceCours.bind(this));

        //Questions
        this.router.get('/enseignant/question/', this.recupererToutesQuestions.bind(this));
        this.router.get('/enseignant/question/:id', this.recupererToutesQuestions.bind(this));
        this.router.get('/enseignant/question/detail/:idEspaceCours/:idQuestion', this.recupererUneQuestion.bind(this));
        this.router.get('/enseignant/question/ajouter/:id/:type', this.recupererAjouterQuestion.bind(this));
        this.router.get('/enseignant/question/choix/:id', this.recupererAjouterChoixTypeQuestion)
        this.router.get('/enseignant/question/modifier/:idEspaceCours/:idQuestion', this.recupererModifierQuestion.bind(this));

        //Devoirs
        this.router.get('/enseignant/devoir/:id', this.recupererTousDevoirsEspaceCours.bind(this));
        this.router.get('/enseignant/devoir/detail/:idEspaceCours/:idDevoir', this.recupererUnDevoir.bind(this));
        this.router.get('/enseignant/devoir/ajouter/:id', this.recupererAjouterDevoir.bind(this));
        this.router.get('/enseignant/devoir/modifier/:idEspaceCours/:idDevoir', this.recupererModifierDevoir.bind(this));

        //Questionnaire
        this.router.get('/enseignant/questionnaire/', this.recupererTousQuestionnaires.bind(this));
        this.router.get('/enseignant/questionnaire/:id', this.recupererTousQuestionnaires.bind(this));
        this.router.get('/enseignant/questionnaire/detail/:idEspaceCours/:idQuestionnaire', this.recupererUnQuestionnaire.bind(this));
        this.router.get('/enseignant/questionnaire/ajouter/:id', this.creerQuestionnaires.bind(this));
        this.router.get('/enseignant/questionnaire/modifier/:idEspaceCours/:idQuestionnaire', this.modifierQuestionnaire.bind(this));
        this.router.get('/enseignant/questionnaire/question/:idEspaceCours/:idQuestionnaire', this.gererQuestionsQuestionnaire.bind(this));

        //#endregion Routes Enseignant

        //#region  Routes Étudiant


        //Cours
        this.router.get('/etudiant/cours/detail/:id', this.recupererUnEspaceCours.bind(this));

        //Devoirs
        this.router.get('/etudiant/devoir/:id', this.recupererTousDevoirsEspaceCours.bind(this));
        this.router.get('/etudiant/devoir/detail/:idEspaceCours/:idDevoir', this.recupererUnDevoir.bind(this));


        // //Questionnaire
        // this.router.get('/etudiant/questionnaire/', this.recupererTousQuestionnaires.bind(this));
        // this.router.get('/etudiant/questionnaire/:id', this.recupererTousQuestionnaires.bind(this));
        // this.router.get('/etudiant/questionnaire/detail/:idEspaceCours/:idQuestionnaire', this.recupererUnQuestionnaire.bind(this));


        //#endregion Routes Étudiants


    }

}
