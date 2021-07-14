import { NextFunction, Request, Response } from 'express';
import { LogHelper } from '../helper/LogHelper';

function errorMiddleware(error: any, req: Request, res: Response, next: NextFunction) {
    const code = error.code || 500;
    const message = error.message || 'Une erreur est survenue';

    var isApi = req.url.startsWith("/api/v");

    LogHelper.logErreur(code, (isApi ? "API" : "WebApp"), message);

    if (isApi) {
        res.status(code)
            .send({
                code,
                error: {
                    message: message
                }
            });
    } else {
        //TODO si c'est webApp redirect sur page d'erreur custom 
        next(error)
    }

}
export default errorMiddleware;