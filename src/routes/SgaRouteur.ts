import { Router, Request, Response, NextFunction, response } from 'express';
import { token } from 'morgan';
import * as flash from 'node-twinkle';

import { EnseignantControlleur } from '../core/controllers/EnseignantControlleur';
import { InvalidParameterError } from '../core/errors/InvalidParameterError';

// TODO: rethink the name for this "router" function, since it's not really an Express router (no longer being "use()"ed inside Express)
export class SgaRouteur {
  router: Router;
  controlleur: EnseignantControlleur;  // contrôleur GRASP

  /**
   * Initialize the Router
   */
  constructor() {
    this.controlleur = new EnseignantControlleur();  // init contrôleur GRASP
    this.router = Router();
    this.init();
  }


  public pageAccueil(req: Request, res: Response, next: NextFunction) {
    //TODO - login - afficher le nom de l'utilisateur dans accueil.pug
    res.render("enseignant/accueil");
  }

  public pageAjouterCours(req: Request, res: Response, next: NextFunction) {
    //TODO - login - afficher le nom de l'utilisateur dans accueil.pug
    let tokenEnseignant = (req.headers.token ? req.headers.token : "e44cd054a9b7f4edee4f1f0ede5ee704") as string;

    let reponse = this.controlleur.recupererCoursSGB(tokenEnseignant);
    reponse.then(function (reponse) {
      //TODO - login - afficher le nom de l'utilisateur dans liste-cours.pug 
      res.render("enseignant/liste-cours-sgb", { cours: reponse.data });
    });
  }

  public ajouterCours(req: Request, res: Response, next: NextFunction) {
    //TODO - login - afficher le nom de l'utilisateur dans accueil.pug
    let tokenEnseignant = (req.headers.token ? req.headers.token : "e44cd054a9b7f4edee4f1f0ede5ee704") as string;
    let idCours = req.params.id;
    let self = this;
    //todo try catch si  le cours existe deja

    try {
      self.controlleur.ajouterCours(tokenEnseignant, idCours);
      res.redirect("/api/v1/sga/enseignant/cours/" + idCours + "/detail");
    } catch (error) {
      console.log(error.message);
      this._errorCode500(error, req, res);
    }    
  }

  /**
   * Methode creer cours
   */

  public recupererCours(req: Request, res: Response, next: NextFunction) {
    //TODO remove le token hardcodé apres le login
    let tokenEnseignant = (req.headers.token ? req.headers.token : "e44cd054a9b7f4edee4f1f0ede5ee704") as string
    res.render("enseignant/liste-cours-sga", { cours: this.controlleur.recupererTousCoursSGA(tokenEnseignant) });
  }

  /**
   * Methode qui retourne les details d'un cours
   */
  public recupererDetailCours(req: Request, res: Response, next: NextFunction) {
    //TODO remove le token hardcodé apres le login
    let tokenEnseignant = (req.headers.token ? req.headers.token : "e44cd054a9b7f4edee4f1f0ede5ee704") as string
    let idCours = req.params.id;
    res.render("enseignant/detail-cours", { cours: this.controlleur.recupererUnCoursSGA(tokenEnseignant, idCours) });
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
   * Methode qui permet de login
   */
  public login(req: Request, res: Response, next: NextFunction) {

    let username = req.params.username;
    let password = req.params.password;
    let reponse = this.controlleur.login(username, password);
    reponse.then(function (reponse) {
      console.log("--------");
      console.log(reponse);
      (req as any).flash('Requete details des etudiants dans un cour');
      res.status(200)
        .send({ reponse })
    })

  }
  /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
  init() {
    this.router.get('/enseignant/accueil', this.pageAccueil.bind(this));
    this.router.get('/enseignant/cours', this.recupererCours.bind(this));
    this.router.get('/enseignant/cours/ajouter', this.pageAjouterCours.bind(this));
    this.router.get('/enseignant/cours/ajouter/:id', this.ajouterCours.bind(this));
    this.router.get('/enseignant/cours/:id/detail', this.recupererDetailCours.bind(this));
    this.router.get('/login/:username&:password', this.login.bind(this))
  }
}

// exporter its configured Express.Router
export const SgaRoutes = new SgaRouteur();
SgaRoutes.init();
