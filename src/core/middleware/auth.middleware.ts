import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { AuthorizationHelper } from '../helper/AuthorizationHelper';

function authMiddleware(req: Request, res: Response, next: NextFunction) {
    //On skip les fichiers de ressources 
    if (AuthorizationHelper.isPublicFile(req)) {
        return next();
    }

    //On n'est pas login
    if (!AuthorizationHelper.isLoggedIn(req)) {
        if (req.url.startsWith("/api/v")) {
            throw new UnauthorizedError();
        }
        return res.redirect("/login");
    }
    //On n'a pas l'accès, selon notre role (etudiant ou enseignant)
    if (!AuthorizationHelper.hasAccess(req)) {
        throw new UnauthorizedError();
    }

    return next();
}

export default authMiddleware;