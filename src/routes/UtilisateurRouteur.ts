import { NextFunction, Request, Response, Router } from 'express';
import { GestionnaireUtilisateur } from '../core/controllers/GestionnaireUtilisateur';
import { AuthorizationHelper } from '../core/helper/AuthorizationHelper';
import authMiddleware from '../core/middleware/auth.middleware';
import { User } from '../core/model/User';


//Le routeur permettant de gérer notre API SGA (Retourne du JSON)
export class UtilisateurRouteur {
    router: Router;
    private gestionnaireUtilisateur: GestionnaireUtilisateur;

    /**
     * Initialize the Router
     */
    constructor(gestionnaireUtilisateur: GestionnaireUtilisateur) {
        this.gestionnaireUtilisateur = gestionnaireUtilisateur;

        this.router = Router();
        this.init();
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


    /**
     * Methode POST du login 
     * @param req 
     * @param res 
     * @param next 
     */
    public login(req: Request, res: Response, next: NextFunction) {
        this.gestionnaireUtilisateur.login(req.body.email, req.body.password)
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
            .catch(next);
    }


    /**
     * Methode GET du logout 
     * @param req 
     * @param res 
     * @param next 
     */
    public logout(req: Request, res: Response, next: NextFunction) {
        var codeStatus = 200;
        req.session.destroy(() => {
            codeStatus = 400;
        });

        res.status(codeStatus)
            .send({
                status: res.status,
            });
    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        //Login
        this.router.get('/login', this.recupererLogin.bind(this));
        this.router.post('/api/v1/login', this.login.bind(this));
        this.router.get('/api/v1/logout', authMiddleware, this.logout.bind(this));
    }
}
