import { Router, Request, Response, NextFunction, response } from 'express';
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
    public ajouterEspaceCours(req: Request, res: Response, next: NextFunction) {
        if (!AuthorizationHelper.isLoggedIn(req)) {
            this._errorCode500(new UnauthorizedError(), req, res);
            return;
        }
        let self = this;
        let coursSGB = JSON.parse(req.body.data);
        self.gestionnaireCours.ajouterEspaceCours(req.body.data, AuthorizationHelper.getCurrentToken(req))
            .then(() => {
                res.status(201)
                    .send({
                        message: 'Success',
                        status: res.status,
                        idEspaceCours: coursSGB._id
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
    public recupererTousEspaceCours(req: Request, res: Response, next: NextFunction) {
        if (!AuthorizationHelper.isLoggedIn(req)) {
            this._errorCode500(new UnauthorizedError(), req, res);
            return;
        }
        try {
            let value = this.gestionnaireCours.recupererTousEspaceCours(AuthorizationHelper.getCurrentToken(req));
            res.status(200)
                .send({
                    message: 'Success',
                    status: res.status,
                    espaceCours: JSON.parse(value)
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
    public recupererUnEspaceCours(req: Request, res: Response, next: NextFunction) {
        if (!AuthorizationHelper.isLoggedIn(req)) {
            this._errorCode500(new UnauthorizedError(), req, res);
            return;
        }
        try {
            let id = parseInt(req.params.id);            
            let espaceCours = this.gestionnaireCours.recupererUnEspaceCours(id);
           
            res.status(200)
                .send({
                    message: 'Success',
                    status: res.status,
                    espaceCours: JSON.parse(espaceCours)
                });
        } catch (error) { this._errorCode500(error, req, res); }

    }


    public supprimerCours(req: Request, res: Response, next: NextFunction) {
        if (!AuthorizationHelper.isLoggedIn(req)) {
            this._errorCode500(new UnauthorizedError(), req, res);
            return;
        }
        let id = parseInt(req.params.id);         
        
        if (this.gestionnaireCours.supprimerEspaceCours(id)) {
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
        this.router.get('/enseignant/cours', this.recupererTousEspaceCours.bind(this));
        this.router.post('/enseignant/cours/ajouter', this.ajouterEspaceCours.bind(this)); 
        this.router.get('/enseignant/cours/detail/:id', this.recupererUnEspaceCours.bind(this)); 
        this.router.delete('/enseignant/cours/supprimer/:id', this.supprimerCours.bind(this));

        //Question
        /*this.router.get('/enseignant/question/', this.recupererQuestions.bind(this));
        this.router.get('/enseignant/question/groupe/:idCoursGroupe', this.recupererQuestions.bind(this));
        this.router.post('/enseignant/question/groupe/:idCoursGroupe/ajouter', this.ajouterQuestion.bind(this));
        this.router.get('/enseignant/question/detail/:id', this.recupererQuestionsParId.bind(this));
        this.router.post('/enseignant/question/modifier/:id', this.modifierQuestion.bind(this));
        this.router.get('/enseignant/question/supprimer/:id', this.supprimerQuestion.bind(this));*/
    }
}
