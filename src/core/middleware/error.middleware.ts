import { NextFunction, Request, Response } from 'express';

function errorMiddleware(error: any, req: Request, res: Response, next: NextFunction) {
    const code = error.code || 500;
    const message = error.message || 'Une erreur est survenue';
    console.error(message);
    if (req.url.startsWith("/api/v")) {
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