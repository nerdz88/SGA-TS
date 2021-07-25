import { NextFunction, Request, Response } from 'express';
import { LogHelper } from '../helper/LogHelper';

function errorMiddleware(error: any, req: Request, res: Response, next: NextFunction) {
    const code = Number.isInteger(error.code) ? error.code : 500;
    const message = error.message || 'Une erreur est survenue';
    const stack = error.stack ? "\r\n" + error.stack : "";

    var isApi = req.url.startsWith("/api/v");

    LogHelper.logErreur(code, (isApi ? "API" : "WebApp"), message + stack);

    if (isApi) {
        res.status(code)
            .send({
                code,
                error: {
                    message: message
                }
            });
    } else {      
        res.redirect("/erreur")
    }

}
export default errorMiddleware;