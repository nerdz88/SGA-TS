import 'reflect-metadata';
import 'es6-shim';
import * as express from 'express';
import * as ExpressSession from 'express-session';
import * as logger from 'morgan';
import * as fileUpload from 'express-fileupload';
import { GestionnaireCours } from './core/controllers/GestionnaireCours';
import { GestionnaireDevoir } from './core/controllers/GestionnaireDevoir';
import { GestionnaireQuestion } from './core/controllers/GestionnaireQuestion';
import { GestionnaireQuestionnaire } from './core/controllers/GestionnaireQuestionnaire';
import { GestionnaireUtilisateur } from './core/controllers/GestionnaireUtilisateur';
import errorMiddleware from './core/middleware/error.middleware';
import { Universite } from './core/service/Universite';
import { SgaRouteur } from './routes/SgaRouteur';
import { UtilisateurRouteur } from './routes/UtilisateurRouteur';
import { WebAppRouteur } from './routes/WebAppRouteur';


export const universite: Universite = new Universite();

// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public expressApp: express.Application;

  //Run configuration methods on the Express instance.
  constructor() {
    this.expressApp = express();
    this.middleware();
    this.routes();
    this.expressApp.set('view engine', 'pug');
    this.expressApp.use(express.static(__dirname + '/public')); // https://expressjs.com/en/starter/static-files.html
    this.expressApp.locals.moment = require("moment");
    this.expressApp.locals.moment.locale("fr");
    //errorMiddleware doit être à la fin
    this.expressApp.use(errorMiddleware);
  }


  // Configure Express middleware.
  private middleware(): void {
    this.expressApp.use(logger('dev'));
    this.expressApp.use(express.json());
    this.expressApp.use(express.urlencoded({ extended: false }));
    this.expressApp.use(ExpressSession(
      {
        secret: 'My Secret Key',
        resave: false,
        saveUninitialized: true
      }));

      this.expressApp.use(fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/"
      }))

    //this.expressApp.use(flash); // https://www.npmjs.com/package/node-twinkle typed using https://stackoverflow.com/a/53786892/1168342 (solution #2)
  }

  // Configure API endpoints.
  private routes(): void {
    let gestionaireCours = new GestionnaireCours(universite);
    let gestionnaireQuestion = new GestionnaireQuestion(universite);
    let gestionnaireQuestionnaire = new GestionnaireQuestionnaire(universite)
    let gestionnaireDevoir = new GestionnaireDevoir(universite);
    let gestionnaireUtilisateur = new GestionnaireUtilisateur();

    //Les routes pour gérer nos utiisateurs;
    this.expressApp.use('/', new UtilisateurRouteur(gestionnaireUtilisateur).router);
    //Les routes d'API
    this.expressApp.use('/api/v1', new SgaRouteur(gestionaireCours, gestionnaireDevoir, gestionnaireQuestion, gestionnaireQuestionnaire).router);
    //Les routes du WebApp
    this.expressApp.use('/', new WebAppRouteur(gestionaireCours, gestionnaireDevoir, gestionnaireQuestion, gestionnaireQuestionnaire).router);
  }

}

export default new App().expressApp;
