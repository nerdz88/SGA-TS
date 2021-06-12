import { Router, Request, Response, NextFunction, response } from 'express';
import { EnseignantControlleur } from '../core/controllers/EnseignantControlleur';
import { TYPES } from "../core/service/Operation"
import { NotFoundError } from '../core/errors/NotFoundError';
import { SGBService } from '../core/service/SGBService';


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
     * @param req 
     * @param res 
     * @param next 
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
     * @param req 
     * @param res 
     * @param next 
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
     * Methode du login qui redirige vers la bonne page
     * @param req 
     * @param res 
     * @param next 
     */
    public login(req: Request, res: Response, next: NextFunction) {
        let email = req.body.email as string;
        let password = req.body.password as string;

        //Doit modifier pour que le controlleur retourne une string 
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

    /**
     * Methode GET qui affiche la page pour ajouter le cours
     * @param req 
     * @param res 
     * @param next 
     */
    public async pageAjouterCours(req: Request, res: Response, next: NextFunction) {
        if (!req.session.loggedIn) {
            res.sendStatus(401);
            return;
        }
        let reponse = await SGBService.recupererJsonCours({ token: this.token });
        if (reponse.message == "Success") {
            res.render("enseignant/liste-cours-sgb", { cours: reponse.data });
        } else {
            //throw erreur 
        }
    }

    /**
     * Methode POST pour ajouter un cours dans le SGA
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    public ajouterCours(req: Request, res: Response, next: NextFunction) {
        if (!req.session.loggedIn) {
            res.sendStatus(401);
            return;
        }
        let coursSGB = JSON.parse(req.body.data);
        let self = this;
        self.controlleur.ajouterElement(TYPES.COURS, req.body.data, this.token)
            .then(() => res.redirect("/enseignant/cours/detail/" + coursSGB._sigle + "/" + coursSGB._id))
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
        if (!req.session.loggedIn) {
            res.sendStatus(401);
            return;
        }
        let value = this.controlleur.recupererElement(TYPES.COURS);
        let course = JSON.parse(value);
        res.render("enseignant/liste-cours-sga", { cours: course })
    }

    /**
     * Methode GET qui retourne les details d'un cours
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    public recupererDetailCours(req: Request, res: Response, next: NextFunction) {
        if (!this.isLoggedIn) {
            return res.sendStatus(401);
        }
        let sigleCours = req.params.sigle;
        let idCoursGroupe = req.params.idCoursGroupe;
        let coursValue = this.controlleur.recupererElementById(TYPES.COURS, sigleCours);
        let cours = JSON.parse(coursValue);
        res.render("enseignant/detail-cours", { cours: cours, groupe: this.getGroupeCoursById(cours.groupeCours, idCoursGroupe) });
    }

    /**
     * Méthode privée qui gère le JSON pour retourner seulement un groupe Cours en fonction de son id
     * @param groupeCours 
     * @param id 
     * @returns 
     */
    private getGroupeCoursById(groupeCours: [any], id: any) {
        return groupeCours.find(c => c._id == id);
    }


    public supprimerCours(req: Request, res: Response, next: NextFunction) {
        if (!this.isLoggedIn) {
            return res.sendStatus(401);
        }
        let sigleCours = req.params.sigle;
        let idCoursGroupe = req.params.idCoursGroupe;
        if (this.controlleur.supprimerElement(TYPES.COURS, sigleCours, idCoursGroupe)) {
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
        let idCoursGroupe = req.params.idCoursGroupe;
        let values = this.controlleur.recupererElement(TYPES.QUESTION);
        let questions = JSON.parse(values);
        if (idCoursGroupe != undefined) {
            questions = questions.filter(q => q._idGroupeCours == idCoursGroupe);
        }
        res.render("enseignant/question/liste-question", { questions: questions, idCoursGroupe: idCoursGroupe })
    }

    public recupererQuestionsParId(req: Request, res: Response, next: NextFunction) {
        if (!this.isLoggedIn) {
            return res.sendStatus(401);
        }
        let idQuestion = req.params.id;
        let values = this.controlleur.recupererElementById(TYPES.QUESTION, idQuestion);
        let question = JSON.parse(values);
        res.render("enseignant/question/detail-question", { question: question });
    }


    /**
     * Methode GET pour afficher toutes les questions d'un prof
     */
    public pageAjouterQuestion(req: Request, res: Response, next: NextFunction) {
        if (!this.isLoggedIn) {
            return res.sendStatus(401);
        }
        let idCoursGroupe = req.params.idCoursGroupe;
        res.render("enseignant/question/ajouter-modifier-question", { idCoursGroupe: idCoursGroupe, question: {}, estModifiable: false });
    }


    public ajouterQuestion(req: Request, res: Response, next: NextFunction) {
        if (!this.isLoggedIn) {
            return res.sendStatus(401);
        }
        let self = this;
        this.controlleur.ajouterElement(TYPES.QUESTION, JSON.stringify(req.body), this.token)
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


    public pageModifierQuestion(req: Request, res: Response, next: NextFunction) {
        if (!this.isLoggedIn) {
            return res.sendStatus(401);
        }

        let idCoursGroupe = req.params.idCoursGroupe;
        let values = this.controlleur.recupererElementById(TYPES.QUESTION, req.params.idQuestion);
        let question = JSON.parse(values);
        res.render("enseignant/question/ajouter-modifier-question", { idCoursGroupe: idCoursGroupe, question: question, estModifiable: true });
    }

    public modifierQuestion(req: Request, res: Response, next: NextFunction) {
        if (!this.isLoggedIn) {
            return res.sendStatus(401);
        }
        let idQuestion = req.params.id;
        this.controlleur.updateElement(TYPES.QUESTION, idQuestion, JSON.stringify(req.body));
        res.status(200)
            .send({
                message: 'Success',
                status: res.status
            });
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
        this.router.get('/enseignant/question/groupe/:idCoursGroupe', this.recupererQuestions.bind(this));
        this.router.get('/enseignant/question/groupe/:idCoursGroupe/ajouter', this.pageAjouterQuestion.bind(this));
        this.router.post('/enseignant/question/groupe/:idCoursGroupe/ajouter', this.ajouterQuestion.bind(this));

        this.router.get('/enseignant/question/detail/:id', this.recupererQuestionsParId.bind(this));
        this.router.get('/enseignant/question/groupe/:idCoursGroupe/modifier/:idQuestion', this.pageModifierQuestion.bind(this));
        this.router.post('/enseignant/question/modifier/:id', this.modifierQuestion.bind(this));
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
