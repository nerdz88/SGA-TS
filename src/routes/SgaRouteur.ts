import { Router, Request, Response, NextFunction, response } from 'express';
import { EnseignantControlleur } from '../core/controllers/EnseignantControlleur';
import { TYPES } from "../core/service/Operation"
import { NotFoundError } from '../core/errors/NotFoundError';
import { User } from '../core/model/User';
import { AuthorizationHelper } from '../core/helper/AuthorizationHelper';
import { UnauthorizedError } from '../core/errors/UnAuthorizedError';
import { GestionnaireCours } from '../core/controllers/GestionnaireCours';
import { GestionnaireQuestion } from '../core/controllers/GestionnaireQuestion';
import { Universite } from '../core/service/Universite';
import { SGBService } from '../core/service/SGBService';


//Le routeur permettant de gérer notre API SGA (Retourne du JSON)
export class SgaRouteur {
    router: Router;
    private gestionnaireCours : GestionnaireCours;
    private gestionnaireQuestion : GestionnaireQuestion;

    /**
     * Initialize the Router
     */
    constructor(gestionnaireCours : GestionnaireCours,gestionnaireQuestion : GestionnaireQuestion) {
        this.gestionnaireCours=gestionnaireCours;  // init contrôleur GRASP
        this.gestionnaireQuestion=gestionnaireQuestion;
        this.router = Router();
        this.init();
    }


    /**
     * Methode du login qui redirige vers la bonne page
     * @param req 
     * @param res 
     * @param next 
     */
    public login(req: Request, res: Response, next: NextFunction) {
        let self = this;
        SGBService.login(req.body.email, req.body.password)
            .then(reponse => {
                let token = reponse.token;
                let user: User = new User(Number.parseInt(reponse.user.id), reponse.user.last_name, reponse.user.first_name, reponse.user.email);

                req.session.user = user;
                req.session.token = token;

                res.status(200)
                    .send({
                        message: 'Success',
                        status: res.status,
                        user: {
                            token: token,
                            info: user
                        }
                    });
            })
            .catch(error => self._errorCode500(error, req, res));
    }


    //#region Gestion Cours

    /**
     * Methode POST pour ajouter un cours dans le SGA
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    public ajouterCours(req: Request, res: Response, next: NextFunction) {
        if (!AuthorizationHelper.isLoggedIn(req)) {
            this._errorCode500(new UnauthorizedError(), req, res);
            return;
        }
        let self = this;
        let coursSGB = JSON.parse(req.body.data);
        self.gestionnaireCours.ajouterCours(req.body.data, AuthorizationHelper.getCurrentToken(req))
            .then(() => {
                res.status(201)
                    .send({
                        message: 'Success',
                        status: res.status,
                        coursInfo: {
                            sigle: coursSGB._sigle,
                            idCoursGroupe: coursSGB._id
                        }
                    });
            })
            .catch(error => {
                self._errorCode500(error, req, res);
            });
    }

    /**
     * Méthode GET qui retourne la liste des cours de l'enseignant
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    public recupererCours(req: Request, res: Response, next: NextFunction) {
        if (!AuthorizationHelper.isLoggedIn(req)) {
            this._errorCode500(new UnauthorizedError(), req, res);
            return;
        }
        try {
            let value = this.gestionnaireCours.recupererCours();
            res.status(200)
                .send({
                    message: 'Success',
                    status: res.status,
                    cours: JSON.parse(value)
                });
        } catch (error) { this._errorCode500(error, req, res); }
    }

    /**
     * Methode GET qui retourne les details d'un cours
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    public recupererDetailCours(req: Request, res: Response, next: NextFunction) {
        if (!AuthorizationHelper.isLoggedIn(req)) {
            this._errorCode500(new UnauthorizedError(), req, res);
            return;
        }
        try {
            let sigleCours = req.params.sigle;
            let idCoursGroupe: number = Number.parseInt(req.params.idCoursGroupe);
            let coursValue = this.gestionnaireCours.recupererGroupeCoursBySigle(sigleCours);
            let cours = JSON.parse(coursValue);
            //TODO Faire en sorte qu'on ne retourne pas tous le groupes dans l'objet cours 
            //Il faudrait créer un obj dans le controlleur qui contient cours et groupe: cours juste les infos de base du cours et groupe pour le groupe courant avec les étudiants
            //On peut ajouter un recupererElementByIdDetail 
            res.status(200)
                .send({
                    message: 'Success',
                    status: res.status,
                    cours: { cours: cours, groupe: cours.groupeCours.find(cg => cg._id == idCoursGroupe) }
                });
        } catch (error) { this._errorCode500(error, req, res); }

    }


    public supprimerCours(req: Request, res: Response, next: NextFunction) {
        if (!AuthorizationHelper.isLoggedIn(req)) {
            this._errorCode500(new UnauthorizedError(), req, res);
            return;
        }
        let sigleCours = req.params.sigle;
        let idCoursGroupe =parseInt(req.params.idCoursGroupe);
        if (this.gestionnaireCours.supprimerCours(sigleCours, idCoursGroupe)) {
            res.status(200)
                .send({
                    message: 'Success',
                    status: res.status
                });
        } else {
            this._errorCode500(new NotFoundError("Le cours n'a pas été supprimé"), req, res);
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
    /*public recupererQuestions(req: Request, res: Response, next: NextFunction) {
        if (!AuthorizationHelper.isLoggedIn(req)) {
            this._errorCode500(new UnauthorizedError(), req, res);
            return;
        }
        try {
            let idCoursGroupe = req.params.idCoursGroupe;
            //TODO lowkey ce n'est pas la job du routeur de faire le filtre, 
            // mais à cause de notre du abstract Operation, il est diffile d'envoyer des paramns custom en primitif 
            //Il faudrait que le controleur s'occupe du filtre
            let values = this.controlleur.recupererElement(TYPES.QUESTION);
            let questions = JSON.parse(values);
            //On est pas tjrs obligé de faire le filtre
            if (idCoursGroupe != undefined) {
                questions = questions.filter((q: { _idGroupeCours: string; }) => q._idGroupeCours == idCoursGroupe);
            }

            res.status(200)
                .send({
                    message: 'Success',
                    status: res.status,
                    data: {
                        idCoursGroupe: idCoursGroupe,
                        questions: questions
                    }
                });

        } catch (error) { this._errorCode500(error, req, res); }
    }*/

    /**
    * Methode GET une question par ID
    * @param req 
    * @param res 
    * @param next 
    */
    /*public recupererQuestionsParId(req: Request, res: Response, next: NextFunction) {
        if (!AuthorizationHelper.isLoggedIn(req)) {
            this._errorCode500(new UnauthorizedError(), req, res);
            return;
        }
        try {
            let values = this.controlleur.recupererElementById(TYPES.QUESTION, req.params.id);

            res.status(200)
                .send({
                    message: 'Success',
                    status: res.status,
                    question: JSON.parse(values)
                });

        } catch (error) { this._errorCode500(error, req, res); }
    }

    public ajouterQuestion(req: Request, res: Response, next: NextFunction) {
        if (!AuthorizationHelper.isLoggedIn(req)) {
            this._errorCode500(new UnauthorizedError(), req, res);
            return;
        }
        let self = this;
        this.controlleur.ajouterElement(TYPES.QUESTION, JSON.stringify(req.body), AuthorizationHelper.getCurrentToken(req))
            .then(() => {
                res.status(201)
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
        if (!AuthorizationHelper.isLoggedIn(req)) {
            this._errorCode500(new UnauthorizedError(), req, res);
            return;
        }
        let idQuestion = req.params.id;
        if (this.controlleur.supprimerElement(TYPES.QUESTION, idQuestion)) {
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
        if (!AuthorizationHelper.isLoggedIn(req)) {
            this._errorCode500(new UnauthorizedError(), req, res);
            return;
        }
        try {
            let idQuestion = req.params.id;
            this.controlleur.updateElement(TYPES.QUESTION, idQuestion, JSON.stringify(req.body));
            res.status(200)
                .send({
                    message: 'Success',
                    status: res.status
                });
        } catch (error) { this._errorCode500(error, req, res); }
    }*/


    //#endregion Gestion Questions


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
        //Login
        this.router.post('/login', this.login.bind(this));

        //Cours
        this.router.get('/enseignant/cours', this.recupererCours.bind(this));
        this.router.post('/enseignant/cours/ajouter', this.ajouterCours.bind(this)); 
        this.router.get('/enseignant/cours/detail/:sigle/:idCoursGroupe', this.recupererDetailCours.bind(this)); 
        this.router.get('/enseignant/cours/supprimer/:sigle/:idCoursGroupe', this.supprimerCours.bind(this));

        //Question
        /*this.router.get('/enseignant/question/', this.recupererQuestions.bind(this));
        this.router.get('/enseignant/question/groupe/:idCoursGroupe', this.recupererQuestions.bind(this));
        this.router.post('/enseignant/question/groupe/:idCoursGroupe/ajouter', this.ajouterQuestion.bind(this));
        this.router.get('/enseignant/question/detail/:id', this.recupererQuestionsParId.bind(this));
        this.router.post('/enseignant/question/modifier/:id', this.modifierQuestion.bind(this));
        this.router.get('/enseignant/question/supprimer/:id', this.supprimerQuestion.bind(this));*/
    }
}
