import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as flash from 'node-twinkle';
import * as ExpressSession from 'express-session';
import { EnseignantControlleur } from './core/controllers/EnseignantControlleur';
import { SgaRouteur } from './routes/SgaRouteur';
import { WebAppRouteur } from './routes/WebAppRouteur';
import { Universite } from './core/service/Universite';
import { GestionnaireQuestion } from './core/controllers/GestionnaireQuestion';
import { GestionnaireCours } from './core/controllers/GestionnaireCours';



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

  }

  // Configure Express middleware.
  private middleware(): void {
    this.expressApp.use(logger('dev'));
    this.expressApp.use(bodyParser.json());
    this.expressApp.use(bodyParser.urlencoded({ extended: false }));
    this.expressApp.use(ExpressSession(
      {
        secret: 'My Secret Key',
        resave: false,
        saveUninitialized: true
      }));
    this.expressApp.use(flash); // https://www.npmjs.com/package/node-twinkle typed using https://stackoverflow.com/a/53786892/1168342 (solution #2)
  }

  // Configure API endpoints.
  private routes(): void {
    let universite =new Universite();
    let gestionaireCours = new GestionnaireCours(universite);
    let gestionnaireQuestion = new GestionnaireQuestion(universite);
    //Les routes d'API
    this.expressApp.use('/api/v1', new SgaRouteur(gestionaireCours,gestionnaireQuestion).router);  
    //Les routes du WebApp
    this.expressApp.use('/', new WebAppRouteur(gestionaireCours,gestionnaireQuestion).router);
  }

}

export default new App().expressApp;
