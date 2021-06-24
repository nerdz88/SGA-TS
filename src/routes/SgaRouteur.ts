import { NextFunction, Request, Response, Router } from 'express';
import { GestionnaireCours } from '../core/controllers/GestionnaireCours';
import { GestionnaireQuestion } from '../core/controllers/GestionnaireQuestion';
import { NotFoundError } from '../core/errors/NotFoundError';
import { UnauthorizedError } from '../core/errors/UnauthorizedError';
import { AuthorizationHelper } from '../core/helper/AuthorizationHelper';
import { User } from '../core/model/User';
import { SGBService } from '../core/service/SGBService';
import {GestionnaireDevoir} from "../core/controllers/GestionnaireDevoir";


//Le routeur permettant de gérer notre API SGA (Retourne du JSON)
export class SgaRouteur {
    router: Router;
    private gestionnaireCours: GestionnaireCours;
    private gestionnaireQuestion: GestionnaireQuestion;
    private gestionnaireDevoir: GestionnaireDevoir;

    /**
     * Initialize the Router
     */
    constructor(gestionnaireCours: GestionnaireCours, gestionnaireQuestion: GestionnaireQuestion, gestionnaireDevoir : GestionnaireDevoir) {
        this.gestionnaireCours = gestionnaireCours;  // init contrôleur GRASP
        this.gestionnaireQuestion = gestionnaireQuestion;
        this.gestionnaireDevoir = gestionnaireDevoir;
        this.router = Router();
        this.init();
    }

    /**
     * Methode du login 
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

                req.session["user"] = user;
                req.session["token"] = token;

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


    /**
     * Methode du logout 
     * @param req 
     * @param res 
     * @param next 
     */
    public logout(req: Request, res: Response, next: NextFunction) {
        if (!AuthorizationHelper.isLoggedIn(req)) {
            this._errorCode500(new UnauthorizedError(), req, res);
            return;
        }
        var codeStatus = 200;
        req.session.destroy(() => {
            codeStatus = 400;
        });

        res.status(codeStatus)
            .send({
                status: res.status,
            });
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
        self.gestionnaireCours.ajouterEspaceCours(req.body.data, AuthorizationHelper.getCurrentToken(req), AuthorizationHelper.getIdUser(req))
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
             let value = this.gestionnaireCours.recupererTousEspaceCours(AuthorizationHelper.getIdUser(req));
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
    public recupererToutesQuestions(req: Request, res: Response, next: NextFunction) {
        if (!AuthorizationHelper.isLoggedIn(req)) {
            this._errorCode500(new UnauthorizedError(), req, res);
            return;
        }
        try {
            let id = parseInt(req.params.id);
            let arrayQuestion: string;

            if (id != undefined) {
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

        } catch (error) { this._errorCode500(error, req, res); }
    }

    /**
    * Methode GET une question par ID
    * @param req 
    * @param res 
    * @param next 
    */
    public recupererUneQuestion(req: Request, res: Response, next: NextFunction) {
        if (!AuthorizationHelper.isLoggedIn(req)) {
            this._errorCode500(new UnauthorizedError(), req, res);
            return;
        }
        try {
            let idEspaceCours = parseInt(req.params.idEspaceCours);
            let idQuestion = parseInt(req.params.idQuestion);
            let question = this.gestionnaireQuestion.recupererUneQuestion(idEspaceCours, idQuestion);

            res.status(200)
                .send({
                    message: 'Success',
                    status: res.status,
                    question: JSON.parse(question)
                });

        } catch (error) { this._errorCode500(error, req, res); }
    }

    public ajouterQuestion(req: Request, res: Response, next: NextFunction) {
        if (!AuthorizationHelper.isLoggedIn(req)) {
            this._errorCode500(new UnauthorizedError(), req, res);
            return;
        }
        try {
            let id = parseInt(req.params.id);
            this.gestionnaireQuestion.ajouterQuestion(id, JSON.stringify(req.body));

            res.status(201)
                .send({
                    message: 'Success',
                    status: res.status
                });
        } catch (error) { this._errorCode500(error, req, res); }

    }

    public supprimerQuestion(req: Request, res: Response, next: NextFunction) {
        if (!AuthorizationHelper.isLoggedIn(req)) {
            this._errorCode500(new UnauthorizedError(), req, res);
            return;
        }
        let idEspaceCours = parseInt(req.params.idEspaceCours);
        let idQuestion = parseInt(req.params.idQuestion);

        if (this.gestionnaireQuestion.supprimerQuestion(idEspaceCours, idQuestion)) {
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
            let idEspaceCours = parseInt(req.params.idEspaceCours);
            let idQuestion = parseInt(req.params.idQuestion);
            this.gestionnaireQuestion.modifierQuestion(idEspaceCours, idQuestion, JSON.stringify(req.body));
            res.status(200)
                .send({
                    message: 'Success',
                    status: res.status
                });
        } catch (error) { this._errorCode500(error, req, res); }
    }

    //#endregion Gestion Questions
    supprimerDevoir(req, res, next){
        if (!AuthorizationHelper.isLoggedIn(req)) {
            this._errorCode500(new UnauthorizedError(), req, res);
            return;
        }
        let idEspaceCours = parseInt(req.params.idEspaceCours);
        let idDevoir = parseInt(req.params.idDevoir);

        if (this.gestionnaireDevoir.supprimerDevoir(idEspaceCours, idDevoir)) {
            res.status(200)
                .send({
                    message: 'Success',
                    status: res.status
                });
        } else {
            this._errorCode500(new NotFoundError("Le devoir n'a pas été supprimé"), req, res);
        }
    }

    recupererTousDevoirsEspaceCours(req, res, next){
        if (!AuthorizationHelper.isLoggedIn(req)) {
            this._errorCode500(new UnauthorizedError(), req, res);
            return;
        }
        try {
            let id = parseInt(req.params.id);
            let arrayQuestion: string;
            arrayQuestion = this.gestionnaireDevoir.recupererTousDevoirsEspaceCours(id);
            res.status(200)
                .send({
                    message: 'Success',
                    status: res.status,
                    data: {
                        idEspaceCours: id ?? "none",
                        questions: JSON.parse(arrayQuestion)
                    }
                });

        } catch (error) { this._errorCode500(error, req, res); }
    }

    recupererUnDevoir(req, res, next){
        if (!AuthorizationHelper.isLoggedIn(req)) {
            this._errorCode500(new UnauthorizedError(), req, res);
            return;
        }
        try {
            let idEspaceCours = parseInt(req.params.idEspaceCours);
            let idDevoir = parseInt(req.params.idDevoir);
            let devoir = this.gestionnaireDevoir.recupererUnDevoir(idEspaceCours, idDevoir);

            res.status(200)
                .send({
                    message: 'Success',
                    status: res.status,
                    question: JSON.parse(devoir)
                });

        } catch (error) { this._errorCode500(error, req, res); }
    }

    modifierDevoir(req, res, next){
        if (!AuthorizationHelper.isLoggedIn(req)) {
            this._errorCode500(new UnauthorizedError(), req, res);
            return;
        }
        try {
            let idEspaceCours = parseInt(req.params.idEspaceCours);
            let idDevoir = parseInt(req.params.idDevoir);
            this.gestionnaireDevoir.modifierDevoir(idEspaceCours, idDevoir, JSON.stringify(req.body));
            res.status(200)
                .send({
                    message: 'Success',
                    status: res.status
                });
        } catch (error) { this._errorCode500(error, req, res); }

    }

    ajouterDevoir(req, res, next){
        if (!AuthorizationHelper.isLoggedIn(req)) {
            this._errorCode500(new UnauthorizedError(), req, res);
            return;
        }
        try {
            let id = parseInt(req.params.id);
            this.gestionnaireDevoir.ajouterDevoir(id, JSON.stringify(req.body));
            res.status(200)
                .send({
                    message: 'Success',
                    status: res.status
                });
        }
        catch (error) {
            this._errorCode500(error, req, res);
        }

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
        //Login
        this.router.post('/login', this.login.bind(this));
        this.router.get('/logout', this.logout.bind(this));

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
        this.router.get('/enseignant/devoir/ajouter/:id', this.ajouterDevoir.bind(this));
        this.router.get('/enseignant/devoir/:id', this.recupererTousDevoirsEspaceCours.bind(this));
        this.router.get('/enseignant/devoir/detail/:idEspaceCours/:idDevoir', this.recupererUnDevoir.bind(this));
        this.router.post('/enseignant/devoir/modifier/:idEspaceCours/:idDevoir', this.modifierDevoir.bind(this));
        this.router.delete('/enseignant/devoir/supprimer/:idEspaceCours/:idDevoir', this.supprimerDevoir.bind(this));
    }
}
