import { Router, Request, Response, NextFunction, response } from 'express';
import { token } from 'morgan';
import * as flash from 'node-twinkle';

import { ControlleurOLD } from './ControlleurOLD';
import { InvalidParameterError } from '../core/errors/InvalidParameterError';

// TODO: rethink the name for this "router" function, since it's not really an Express router (no longer being "use()"ed inside Express)
export class SgaRouteur {
    router: Router;
    controlleur: ControlleurOLD;  // contrôleur GRASP
  
  /**
   * démarrer le jeu
   */
   public demarrerJeu(req: Request, res: Response, next: NextFunction) {
    let nom = req.body.nom;
    try {
      // POST ne garantit pas que tous les paramètres de l'opération système sont présents
      this._demarrerJeu(nom, req, res);
    } catch (error) {
      console.log(error.message);
      this._errorCode500(error, req, res);
    }
  }

  private _demarrerJeu(nom: any, req, res: Response<any>) {
    if (nom === undefined) {
      throw new InvalidParameterError('Le paramètre nom est absent');
    }

    // Invoquer l'opération système (du DSS) dans le contrôleur GRASP
    let joueur = this.controlleur.demarrerJeu(nom);
    let joueurObj = JSON.parse(joueur);
    (req as any).flash('Nouveau jeu pour ' + nom);
    res.status(201)
      .send({
        message: 'Success',
        status: res.status,
        joueur: joueurObj
      });
  }

  /**
   * jouer une fois aux dés
   */
  public jouer(req: Request, res: Response, next: NextFunction) {
    try {
      this._jouer(req, res);
    } catch (error) {
      console.log(error.message);
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

  private _jouer(req, res: Response<any>) {
    let nom = req.params.nom;
    let resultat = this.controlleur.jouer(nom);
    let resultatObj = JSON.parse(resultat);
    (req as any).flash('Resultat pour ' + nom + ': ' + resultatObj.v1 + ' + ' + resultatObj.v2 + ' = ' + resultatObj.somme);
    res.status(200)
      .send({
        message: 'Success',
        status: res.status,
        resultat
      });
  }

  /**
   * terminer 
   */
  public terminerJeu(req: Request, res: Response, next: NextFunction) {

    // obtenir nom de la requête
    let nom = req.params.nom;

    try {
      // Invoquer l'opération système (du DSS) dans le contrôleur GRASP
      let resultat = this.controlleur.terminerJeu(nom);
      (req as any).flash('Jeu terminé pour ' + nom);
      res.status(200)
        .send({
          message: 'Success',
          status: res.status,
          resultat
        });

    } catch (error) {
      console.log(error.message);
      this._errorCode500(error, req, res);

    }

  }

  init() {
    this.router.post('/demarrerJeu', this.demarrerJeu.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342
    this.router.get('/jouer/:nom', this.jouer.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342
    this.router.get('/terminerJeu/:nom', this.terminerJeu.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342
  }
}

// exporter its configured Express.Router
export const SgaRoutes = new SgaRouteur();
SgaRoutes.init();