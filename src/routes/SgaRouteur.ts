import { NextFunction, Request, Response, Router } from 'express';
import { GestionnaireCours } from '../core/controllers/GestionnaireCours';
import { GestionnaireDevoir } from "../core/controllers/GestionnaireDevoir";
import { GestionnaireQuestion } from '../core/controllers/GestionnaireQuestion';
import { GestionnaireQuestionnaire } from '../core/controllers/GestionnaireQuestionnaire';
import { HttpError } from '../core/errors/HttpError';
import { InvalidParameterError } from '../core/errors/InvalidParameterError';
import { NotFoundError } from '../core/errors/NotFoundError';
import { UnauthorizedError } from '../core/errors/UnauthorizedError';
import { AuthorizationHelper } from '../core/helper/AuthorizationHelper';
import authMiddleware from '../core/middleware/auth.middleware';
import * as fs from 'fs';

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

    //#region Enseignant 

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
        let espaceCours = JSON.parse(this.gestionnaireCours.recupererUnEspaceCours(id));

        let hasAccess = true;
        if (AuthorizationHelper.isEtudiant(req)) {
            hasAccess = espaceCours._etudiants.find((e: { _id: number; }) => e._id == AuthorizationHelper.getIdUser(req)) != undefined;
        }
        else {
            hasAccess = parseInt(espaceCours._enseignantId) == AuthorizationHelper.getIdUser(req);
        }
        if (!hasAccess) {
            throw new UnauthorizedError();
        }

        res.status(200)
            .send({
                message: 'Success',
                status: res.status,
                espaceCours: espaceCours
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
        let id = req.params.id;
        let arrayQuestion: string;
        if (id == undefined) {
            arrayQuestion = this.gestionnaireQuestion.recupererToutesQuestions(AuthorizationHelper.getIdUser(req));
        } else {
            arrayQuestion = this.gestionnaireQuestion.recupererToutesQuestionsEspaceCours(parseInt(id));
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
        let value = JSON.stringify(req.body);
        this.gestionnaireQuestion.ajouterQuestion(id, value);

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

    public supprimerDevoir(req: Request, res: Response, next: NextFunction) {
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

    public recupererTousDevoirsEspaceCours(req: Request, res: Response, next: NextFunction) {
        let id = parseInt(req.params.id);
        let arrayDevoirs: string;
        arrayDevoirs = this.gestionnaireDevoir.recupererTousDevoirsEspaceCours(id);
        res.status(200).send({
            message: 'Success',
            status: res.status,
            data: {
                idEspaceCours: id ?? "none",
                devoirs: JSON.parse(arrayDevoirs)
            }
        });
    }

    public recupererUnDevoir(req: Request, res: Response, next: NextFunction) {
        let ordreTri: number = parseInt(req.query.o?.toString());
        let idEspaceCours = parseInt(req.params.idEspaceCours);
        let idDevoir = parseInt(req.params.idDevoir);
        let devoir = this.gestionnaireDevoir.recupererUnDevoir(idEspaceCours, idDevoir, ordreTri);

        console.log(devoir)
        res.status(200)
            .send({
                message: 'Success',
                status: res.status,
                devoir: JSON.parse(devoir)
            });
    }

    public modifierDevoir(req: Request, res: Response, next: NextFunction) {
        let idEspaceCours = parseInt(req.params.idEspaceCours);
        let idDevoir = parseInt(req.params.idDevoir);
        this.gestionnaireDevoir.modifierDevoir(idEspaceCours, idDevoir, JSON.stringify(req.body));
        res.status(200)
            .send({
                message: 'Success',
                status: res.status
            });
    }

    public ajouterDevoir(req: Request, res: Response, next: NextFunction) {
        let id = parseInt(req.params.id);
        this.gestionnaireDevoir.ajouterDevoir(id, JSON.stringify(req.body));
        res.status(201)
            .send({
                message: 'Success',
                status: res.status
            });
    }

    public corrigerDevoir(req: any, res: Response, next: NextFunction) {
        let hasFichier = req.files != undefined && req.files.devoirRetroaction != undefined;

        let idEspaceCours = parseInt(req.body.idEspaceCours);
        let idDevoir = parseInt(req.body.idDevoir);
        let idRemise = parseInt(req.body.idRemise);
        // let idEtudiant = req.body.idEtudiant;
        let note = parseInt(req.body.noteDevoir);
        let token = AuthorizationHelper.getCurrentToken(req);
        let pathUpload;

        let self = this;

        if (hasFichier) {
            pathUpload = `./uploads/devoirs/${idEspaceCours}/${idDevoir}/retroaction`;
            fs.mkdirSync(pathUpload, { recursive: true });
            let newFilename = `${idEspaceCours}-${idDevoir}-${idRemise}-devoir-retroaction-${new Date().getTime()}.pdf`;
            pathUpload += `/${newFilename}`;

            req.files.devoirRetroaction.mv(pathUpload).then(() => {
                doCorrectionDevoir();
            }).catch(next);
        } else {
            doCorrectionDevoir();
        }

     
        function doCorrectionDevoir() {
            self.gestionnaireDevoir.corrigerDevoir(idEspaceCours, idDevoir,
                    idRemise, note,
                    pathUpload ?? "", token)
                .then(() => {
                    res.status(200).send({
                        message: 'Success',
                        status: res.status,
                        path: pathUpload ?? "NONE"
                    });
                }).catch(next);
        }
    }

    public recupererTousDevoirsZip(req: any, res: Response, next: NextFunction) {
        let idEspaceCours = req.params.idEspaceCours;
        let idDevoir = req.params.idDevoir;
        var zipPath = this.gestionnaireDevoir.creerZipCorrectionDevoir(idEspaceCours, idDevoir);
        res.download(zipPath);
    }

    public corrigerTousDevoirsZip(req: any, res: Response, next: NextFunction) {
        if (!req.files || !req.files.devoirRetroactionZip)
            throw new InvalidParameterError("Vous devez fournir un fichier zip");

        let idEspaceCours = req.body.idEspaceCours;
        let idDevoir = req.body.idDevoir;
        let token = AuthorizationHelper.getCurrentToken(req);

        let pathUpload = `./uploads/devoirs/${idEspaceCours}/${idDevoir}`;
        fs.mkdirSync(pathUpload, { recursive: true });
        let newFilename = `correction-devoir-${idDevoir}-retroaction-${new Date().getTime()}.zip`;
        pathUpload += `/${newFilename}`;

        req.files.devoirRetroactionZip.mv(pathUpload).then(() => {
            this.gestionnaireDevoir.corrigerTousDevoirsZip(idEspaceCours, idDevoir, pathUpload, token)
                .then(() => {
                    res.status(200).send({
                        message: 'Success',
                        status: res.status
                    });
                }).catch(next);
        }).catch(next);
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
            message: 'Success',
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

    //#endregion Enseignant

    //#region Étudiant

    //#region Cours

    /**
     * Méthode GET qui retourne la liste des cours d'un étudiant
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    public recupererTousEspaceCoursEtudiant(req: Request, res: Response, next: NextFunction) {
        let espaceCours = this.gestionnaireCours.recupererTousEspaceCoursEtudiant(AuthorizationHelper.getIdUser(req));
        res.status(200)
            .send({
                message: 'Success',
                status: res.status,
                espaceCours: JSON.parse(espaceCours)
            });
    }

    //#endregion Cours

    //#region Devoir

    public recupererUnDevoirEtudiant(req: Request, res: Response, next: NextFunction) {
        let idEspaceCours = parseInt(req.params.idEspaceCours);
        let idDevoir = parseInt(req.params.idDevoir);
        let devoir = this.gestionnaireDevoir.recupererUnDevoirEtudiant(idEspaceCours, idDevoir, AuthorizationHelper.getIdUser(req));

        res.status(200)
            .send({
                message: 'Success',
                status: res.status,
                devoir: JSON.parse(devoir)
            });
    }

    public recupererTousDevoirsEtudiant(req: Request, res: Response, next: NextFunction) {
        let id = parseInt(req.params.id);
        let arrayDevoirs = this.gestionnaireDevoir.recupererTousDevoirsEtudiant(AuthorizationHelper.getIdUser(req), id);

        res.status(200).send({
            message: 'Success',
            status: res.status,
            data: {
                devoirs: JSON.parse(arrayDevoirs)
            }
        });
    }

    public remettreDevoir(req: any, res: Response, next: NextFunction) {
        if (!req.files || !req.files.devoir)
            throw new InvalidParameterError("Vous devez fournir un fichier pdf");

        let idEspaceCours = parseInt(req.body.idEspaceCours);
        let idDevoir = parseInt(req.body.idDevoir);
        let etudiant = AuthorizationHelper.getCurrentUserInfo(req);

        let pathUpload = `./uploads/devoirs/${idEspaceCours}/${idDevoir}/remise`;
        fs.mkdirSync(pathUpload, { recursive: true });
        let newFilename = `${idEspaceCours}-${idDevoir}-${etudiant._id}-${etudiant._code_permanent}-devoir-${new Date().getTime()}.pdf`;
        pathUpload += `/${newFilename}`;

        req.files.devoir.mv(pathUpload).then(() => {
            this.gestionnaireDevoir.remettreDevoir(idEspaceCours, idDevoir, etudiant._id, pathUpload);

            res.status(200).send({
                message: 'Success',
                status: res.status,
                path: pathUpload
            });
        }).catch(next);
    }

    // public recupererDevoirACorriger(req: any, res: Response, next: NextFunction) {

    //     let idEspaceCours = req.params.idEspaceCours;
    //     let idDevoir = req.params.idDevoir;
    //     this.gestionnaireDevoir.recupererUnDevoir

    // }



    //#endregion Devoir


    //#region Questionnaire

    public ajouterReponseTentative(req: Request, res: Response, next: NextFunction) {
        let idEspaceCours = parseInt(req.params.idEspaceCours);
        let idQuestionnaire = parseInt(req.params.idQuestionnaire);
        let idQuestion = parseInt(req.params.idQuestion);

        this.gestionnaireQuestionnaire
            .ajouterReponseTentative(idEspaceCours,
                idQuestionnaire,
                idQuestion,
                AuthorizationHelper.getIdUser(req),
                JSON.stringify(req.body));

        res.status(200)
            .send({
                message: 'Success',
                status: res.status,

            });
    }

    public terminerTentative(req: Request, res: Response, next: NextFunction) {
        let idEspaceCours = parseInt(req.params.idEspaceCours);
        let idQuestionnaire = parseInt(req.params.idQuestionnaire);

        this.gestionnaireQuestionnaire
            .terminerTentativeEtudiant(idEspaceCours, idQuestionnaire, AuthorizationHelper.getIdUser(req));

        res.status(200)
            .send({
                message: 'Success',
                status: res.status,

            });
    }

    //#endregion Questionnaire


    //#endregion Étudiants

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {


        //Indique qu'on veut être login
        this.router.use(authMiddleware);

        //#region Enseignant

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
        this.router.put('/enseignant/question/modifier/:idEspaceCours/:idQuestion', this.modifierQuestion.bind(this));
        this.router.delete('/enseignant/question/supprimer/:idEspaceCours/:idQuestion', this.supprimerQuestion.bind(this));

        // Devoirs
        this.router.get('/enseignant/devoir/:id', this.recupererTousDevoirsEspaceCours.bind(this));
        this.router.post('/enseignant/devoir/ajouter/:id', this.ajouterDevoir.bind(this));
        this.router.post('/enseignant/devoir/corriger/', this.corrigerDevoir.bind(this));
        this.router.get('/enseignant/devoir/detail/:idEspaceCours/:idDevoir', this.recupererUnDevoir.bind(this));
        this.router.put('/enseignant/devoir/modifier/:idEspaceCours/:idDevoir', this.modifierDevoir.bind(this));
        this.router.delete('/enseignant/devoir/supprimer/:idEspaceCours/:idDevoir', this.supprimerDevoir.bind(this));
        this.router.get('/enseignant/devoir/zip/:idEspaceCours/:idDevoir', this.recupererTousDevoirsZip.bind(this));
        this.router.post('/enseignant/devoir/corriger/batch', this.corrigerTousDevoirsZip.bind(this));

        // Questionnaires
        this.router.get('/enseignant/questionnaire/', this.recupererTousQuestionnaires.bind(this));
        this.router.get('/enseignant/questionnaire/:id', this.recupererTousQuestionnaires.bind(this));
        this.router.get('/enseignant/questionnaire/detail/:idEspaceCours/:idQuestionnaire', this.recupererUnQuestionnaire.bind(this));
        this.router.post('/enseignant/questionnaire/ajouter/:id', this.creerQuestionnaire.bind(this));
        this.router.put('/enseignant/questionnaire/modifier/:idEspaceCours/:idQuestionnaire', this.modifierQuestionnaire.bind(this));
        this.router.delete('/enseignant/questionnaire/supprimer/:idEspaceCours/:idQuestionnaire', this.supprimerQuestionnaire.bind(this));
        this.router.put('/enseignant/questionnaire/question/:idEspaceCours/:idQuestionnaire', this.gererQuestionsQuestionnaire.bind(this));

        //#endregion Enseignant


        //#region Étudiant

        //Cours
        this.router.get('/etudiant/cours', this.recupererTousEspaceCoursEtudiant.bind(this));
        this.router.get('/etudiant/cours/detail/:id', this.recupererUnEspaceCours.bind(this));

        //Devoirs
        this.router.get('/etudiant/devoir/:id', this.recupererTousDevoirsEtudiant.bind(this));
        this.router.get('/etudiant/devoir/detail/:idEspaceCours/:idDevoir', this.recupererUnDevoirEtudiant.bind(this));
        this.router.post('/etudiant/devoir/remettre', this.remettreDevoir.bind(this));

        //Questionnaire
        this.router.post('/etudiant/questionnaire/question/save/:idEspaceCours/:idQuestionnaire/:idQuestion', this.ajouterReponseTentative.bind(this));
        this.router.get('/etudiant/questionnaire/terminer/:idEspaceCours/:idQuestionnaire', this.terminerTentative.bind(this));

        //#endregion Étudiant

    }
}
