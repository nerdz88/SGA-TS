import { NextFunction, Request, Response, Router } from 'express';
import { GestionnaireCours } from '../core/controllers/GestionnaireCours';
import { GestionnaireDevoir } from "../core/controllers/GestionnaireDevoir";
import { GestionnaireQuestion } from '../core/controllers/GestionnaireQuestion';
import { GestionnaireQuestionnaire } from '../core/controllers/GestionnaireQuestionnaire';
import { NotFoundError } from '../core/errors/NotFoundError';
import { AuthorizationHelper } from '../core/helper/AuthorizationHelper';
import authMiddleware from '../core/middleware/auth.middleware';


//Le routeur permettant de gérer notre API SGA (Retourne du JSON)
export class SgaRouteur {
    router: Router;
    private gestionnaireCours: GestionnaireCours;
    private gestionnaireQuestion: GestionnaireQuestion;
    private gestionnaireDevoir: GestionnaireDevoir;
    private gestionnaireQuestionnaire: GestionnaireQuestionnaire;
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



    //#region Gestion Cours

    /**
     * Methode POST pour ajouter un cours dans le SGA
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    public ajouterEspaceCours(req: Request, res: Response, next: NextFunction) {

        let coursSGB = JSON.parse(req.body.data);
        this.gestionnaireCours.ajouterEspaceCours(req.body.data, AuthorizationHelper.getCurrentToken(req), AuthorizationHelper.getIdUser(req))
            .then(() => {
                res.status(201)
                    .send({
                        message: 'Success',
                        status: res.status,
                        idEspaceCours: coursSGB._id
                    });
            }).catch(next);
    }

    /**
     * Méthode GET qui retourne la liste des cours de l'enseignant
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    public recupererTousEspaceCours(req: Request, res: Response, next: NextFunction) {
        let value = this.gestionnaireCours.recupererTousEspaceCours(AuthorizationHelper.getIdUser(req));
        res.status(200)
            .send({
                message: 'Success',
                status: res.status,
                espaceCours: JSON.parse(value)
            });
    }

    /**
     * Methode GET qui retourne les details d'un cours
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    public recupererUnEspaceCours(req: Request, res: Response, next: NextFunction) {
        let id = parseInt(req.params.id);
        let espaceCours = this.gestionnaireCours.recupererUnEspaceCours(id);
        res.status(200)
            .send({
                message: 'Success',
                status: res.status,
                espaceCours: JSON.parse(espaceCours)
            });
    }


    public supprimerCours(req: Request, res: Response, next: NextFunction) {
        let id = parseInt(req.params.id);
        if (this.gestionnaireCours.supprimerEspaceCours(id)) {
            res.status(200)
                .send({
                    message: 'Success',
                    status: res.status
                });
        } else {
            throw new NotFoundError("Le cours n'a pas été supprimé");
        }
    }

    //#endregion Gestion Cours



    //#region Gestion Questions


    /**
     * Methode GET de la liste de questions (pour 1 prof ou 1 cours groupe)
     * @param req 
     * @param res 
     * @param next 
     */
    public recupererToutesQuestions(req: Request, res: Response, next: NextFunction) {
        let idParam = req.params.id
        let id;
        let arrayQuestion: string;
        if (idParam === "") {
            id = undefined;
        }
        if (id == undefined) {
            arrayQuestion = this.gestionnaireQuestion.recupererToutesQuestions(AuthorizationHelper.getIdUser(req));
        } else {
            arrayQuestion = this.gestionnaireQuestion.recupererToutesQuestionsEspaceCours(id);
        }

        res.status(200)
            .send({
                message: 'Success',
                status: res.status,
                data: {
                    idEspaceCours: id ?? "none",
                    questions: JSON.parse(arrayQuestion)
                }
            });
    }

    /**
    * Methode GET une question par ID
    * @param req 
    * @param res 
    * @param next 
    */
    public recupererUneQuestion(req: Request, res: Response, next: NextFunction) {
        let idEspaceCours = parseInt(req.params.idEspaceCours);
        let idQuestion = parseInt(req.params.idQuestion);
        let question = this.gestionnaireQuestion.recupererUneQuestion(idEspaceCours, idQuestion);

        res.status(200)
            .send({
                message: 'Success',
                status: res.status,
                question: JSON.parse(question)
            });
    }

    public ajouterQuestion(req: Request, res: Response, next: NextFunction) {
        let id = parseInt(req.params.id);
        this.gestionnaireQuestion.ajouterQuestion(id, JSON.stringify(req.body));

        res.status(201)
            .send({
                message: 'Success',
                status: res.status
            });
    }

    public supprimerQuestion(req: Request, res: Response, next: NextFunction) {
        let idEspaceCours = parseInt(req.params.idEspaceCours);
        let idQuestion = parseInt(req.params.idQuestion);

        if (this.gestionnaireQuestion.supprimerQuestion(idEspaceCours, idQuestion)) {
            res.status(200)
                .send({
                    message: 'Success',
                    status: res.status
                });
        } else {
            throw new NotFoundError("La question n'a pas été supprimé");
        }
    }

    public modifierQuestion(req: Request, res: Response, next: NextFunction) {
        let idEspaceCours = parseInt(req.params.idEspaceCours);
        let idQuestion = parseInt(req.params.idQuestion);
        this.gestionnaireQuestion.modifierQuestion(idEspaceCours, idQuestion, JSON.stringify(req.body));
        res.status(200)
            .send({
                message: 'Success',
                status: res.status
            });
    }

    //#endregion Gestion Questions


    //#region Gestion Devoir

    supprimerDevoir(req: Request, res: Response, next: NextFunction) {
        let idEspaceCours = parseInt(req.params.idEspaceCours);
        let idDevoir = parseInt(req.params.idDevoir);

        if (this.gestionnaireDevoir.supprimerDevoir(idEspaceCours, idDevoir)) {
            res.status(200)
                .send({
                    message: 'Success',
                    status: res.status
                });
        } else {
            throw new NotFoundError("Le devoir n'a pas été supprimé");
        }
    }

    recupererTousDevoirsEspaceCours(req: Request, res: Response, next: NextFunction) {
        let id = parseInt(req.params.id);
        let arrayDevoirs: string;
        arrayDevoirs = this.gestionnaireDevoir.recupererTousDevoirsEspaceCours(id);
        res.status(200).send({
            message: 'Success',
            status: res.status,
            data: {
                idEspaceCours: id ?? "none",
                questions: JSON.parse(arrayDevoirs)
            }
        });
    }

    recupererUnDevoir(req: Request, res: Response, next: NextFunction) {
        let ordreTri: number = parseInt(req.query.o?.toString());
        let idEspaceCours = parseInt(req.params.idEspaceCours);
        let idDevoir = parseInt(req.params.idDevoir);
        let devoir = this.gestionnaireDevoir.recupererUnDevoir(idEspaceCours, idDevoir, ordreTri);

        res.status(200)
            .send({
                message: 'Success',
                status: res.status,
                question: JSON.parse(devoir)
            });
    }

    modifierDevoir(req: Request, res: Response, next: NextFunction) {
        let idEspaceCours = parseInt(req.params.idEspaceCours);
        let idDevoir = parseInt(req.params.idDevoir);
        this.gestionnaireDevoir.modifierDevoir(idEspaceCours, idDevoir, JSON.stringify(req.body));
        res.status(200)
            .send({
                message: 'Success',
                status: res.status
            });
    }

    ajouterDevoir(req: Request, res: Response, next: NextFunction) {
        let id = parseInt(req.params.id);
        this.gestionnaireDevoir.ajouterDevoir(id, JSON.stringify(req.body));
        res.status(201)
            .send({
                message: 'Success',
                status: res.status
            });
    }

    //#endregion Gestion Devoirs


    //#region Gestion Questionnaires

    public recupererTousQuestionnaires(req: Request, res: Response, next: NextFunction) {
        let id = req.params.id;
        let arrayQuestionnaire: string;
        if (id == undefined) {
            arrayQuestionnaire = this.gestionnaireQuestionnaire.recupererTousQuestionnaires(AuthorizationHelper.getIdUser(req))
        } else {
            arrayQuestionnaire = this.gestionnaireQuestionnaire.recupererTousQuestionnairesEspaceCours(parseInt(id));
        }

        res.status(200)
            .send({
                message: 'Success',
                status: res.status,
                data: {
                    idEspaceCours: id ?? "none",
                    questionnaires: JSON.parse(arrayQuestionnaire)
                }
            });
    }

    public recupererUnQuestionnaire(req: Request, res: Response, next: NextFunction) {
        let idEspaceCours = parseInt(req.params.idEspaceCours);
        let idQuestionnaire = parseInt(req.params.idQuestionnaire);

        let questionnaire = this.gestionnaireQuestionnaire.recupererUnQuestionnaire(idEspaceCours, idQuestionnaire);
        res.status(200)
            .send({
                message: 'Success',
                status: res.status,
                questionnaire: JSON.parse(questionnaire)
            });
    }

    public gererQuestionsQuestionnaire(req: Request, res: Response, next: NextFunction) {
        let idEspaceCours = parseInt(req.params.idEspaceCours);
        let idQuestionnaire = parseInt(req.params.idQuestionnaire);
        let arrayQuestions = JSON.stringify(req.body.data.split(","));

        this.gestionnaireQuestionnaire.gererQuestionsQuestionnaire(idEspaceCours, idQuestionnaire, arrayQuestions);

        res.status(200).send({
            message: 'Succes',
            status: res.status
        });
    }

    public creerQuestionnaire(req: Request, res: Response, next: NextFunction) {
        let id = parseInt(req.params.id);
        let params = JSON.stringify(req.body);
        let idQuestionnaire = this.gestionnaireQuestionnaire.creerQuestionnaire(id, params);
        res.status(201)
            .send({
                message: 'Success',
                status: res.status,
                idQuestionnaire: idQuestionnaire
            });
    }

    public modifierQuestionnaire(req: Request, res: Response, next: NextFunction) {
        let idEspaceCours = parseInt(req.params.idEspaceCours);
        let idQuestionnaire = parseInt(req.params.idQuestionnaire);
        let params = JSON.stringify(req.body);
        this.gestionnaireQuestionnaire.modifierQuestionnaire(idEspaceCours, idQuestionnaire, params);
        res.status(200)
            .send({
                message: 'Success',
                status: res.status,
                idQuestionnaire: idQuestionnaire
            });
    }

    public supprimerQuestionnaire(req: Request, res: Response, next: NextFunction) {
        let idEspaceCours = parseInt(req.params.idEspaceCours);
        let idQuestionnaire = parseInt(req.params.idQuestionnaire);

        if (this.gestionnaireQuestionnaire.supprimerQuestionnaire(idEspaceCours, idQuestionnaire)) {
            res.status(200)
                .send({
                    message: 'Success',
                    status: res.status
                });
        } else {
            throw new NotFoundError("La question n'a pas été supprimé");
        }
    }

    //#endregion Gestion Questionnaires

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        //Indique qu'on veut être login
        this.router.use(authMiddleware);

        //Cours
        this.router.get('/enseignant/cours', this.recupererTousEspaceCours.bind(this));
        this.router.post('/enseignant/cours/ajouter', this.ajouterEspaceCours.bind(this));
        this.router.get('/enseignant/cours/detail/:id', this.recupererUnEspaceCours.bind(this));
        this.router.delete('/enseignant/cours/supprimer/:id', this.supprimerCours.bind(this));

        //Question
        this.router.get('/enseignant/question/', this.recupererToutesQuestions.bind(this));
        this.router.get('/enseignant/question/:id', this.recupererToutesQuestions.bind(this));
        this.router.get('/enseignant/question/detail/:idEspaceCours/:idQuestion', this.recupererUneQuestion.bind(this));
        this.router.post('/enseignant/question/ajouter/:id', this.ajouterQuestion.bind(this));
        this.router.post('/enseignant/question/modifier/:idEspaceCours/:idQuestion', this.modifierQuestion.bind(this));
        this.router.delete('/enseignant/question/supprimer/:idEspaceCours/:idQuestion', this.supprimerQuestion.bind(this));

        // Devoirs
        this.router.get('/enseignant/devoir/:id', this.recupererTousDevoirsEspaceCours.bind(this));
        this.router.post('/enseignant/devoir/ajouter/:id', this.ajouterDevoir.bind(this));
        this.router.get('/enseignant/devoir/detail/:idEspaceCours/:idDevoir', this.recupererUnDevoir.bind(this));
        this.router.post('/enseignant/devoir/modifier/:idEspaceCours/:idDevoir', this.modifierDevoir.bind(this));
        this.router.delete('/enseignant/devoir/supprimer/:idEspaceCours/:idDevoir', this.supprimerDevoir.bind(this));

        // Questionnaires
        this.router.get('/enseignant/questionnaire/', this.recupererTousQuestionnaires.bind(this));
        this.router.get('/enseignant/questionnaire/:id', this.recupererTousQuestionnaires.bind(this));
        this.router.post('/enseignant/questionnaire/detail/:idEspaceCours/:idQuestionnaire', this.recupererUnQuestionnaire.bind(this));
        this.router.post('/enseignant/questionnaire/ajouter/:id', this.creerQuestionnaire.bind(this));
        this.router.post('/enseignant/questionnaire/modifier/:idEspaceCours/:idQuestionnaire', this.modifierQuestionnaire.bind(this));
        this.router.delete('/enseignant/questionnaire/supprimer/:idEspaceCours/:idQuestionnaire', this.supprimerQuestionnaire.bind(this));
        this.router.post('/enseignant/questionnaire/question/:idEspaceCours/:idQuestionnaire', this.gererQuestionsQuestionnaire.bind(this));
    
    }
}
