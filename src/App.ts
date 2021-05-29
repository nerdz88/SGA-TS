import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as flash from 'node-twinkle';
import * as ExpressSession from 'express-session';

import { SgaRoutes } from './routes/SgaRouteur';

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
    // let router = express.Router();
    // router.get('/', (req, res, next) => {
    //   if (req.session.loggedIn) {
    //     res.redirect("/api/v1/sga/enseignant/accueil");
    //   } 
    //   else {
    //     let messages = res.locals.has_flashed_messages() ? res.locals.get_flashed_messages() : [];
    //     res.render('connection', { title: 'Service Gestion des Apprentissages', flashedMessages: messages });
    //   }
    // });

    //this.expressApp.use('/', router);  // routage de base
    this.expressApp.use('/', SgaRoutes.router);  // tous les URI pour le scénario jeu (DSS) commencent ainsi
  }

}

export default new App().expressApp;
