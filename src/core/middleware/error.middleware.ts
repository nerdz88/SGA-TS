import { NextFunction, Request, Response } from 'express';

function errorMiddleware(error: any, req: Request, res: Response, next: NextFunction) {
    const code = error.code || 500;
    const message = error.message || 'Une erreur est survenue';
    //TODO si c'est webApp redirect sur page d'erreur custom 
    res.status(code)
        .send({
            code,
            error:{
                message: message
            } 
        });
}
export default errorMiddleware;