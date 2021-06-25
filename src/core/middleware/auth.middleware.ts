import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { AuthorizationHelper } from '../helper/AuthorizationHelper';

function authMiddleware(req: Request, res: Response, next: NextFunction) {
    //On skip les fichiers de ressources 

    if (!isPublicFile(req.originalUrl) && !AuthorizationHelper.isLoggedIn(req)) {
        if(req.baseUrl.startsWith("/api/v"))
        {
            throw new UnauthorizedError();
        }
        else
        {  
            res.redirect("/login");
        }                   
    }

    next();    

    function isPublicFile(path: string) : boolean
    {
        return path.startsWith("/lib") || path.startsWith("/css")
    }
}

export default authMiddleware;