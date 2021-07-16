import { Request } from 'express';


export class AuthorizationHelper {
    public static isLoggedIn(req: Request): boolean {
        return req.session["token"] != undefined;
    }

    public static isEtudiant(req: Request): boolean {
        return req.session["isEtudiant"];
    }

    public static isDevLoggedIn(req: Request): boolean {
        return req.session["isDevLoggedIn"];
    }

    public static getCurrentToken(req: Request): string {
        return req.session["token"];
    }

    public static getCurrentUserInfo(req: Request) {
        return req.session["user"];
    }

    public static getIdUser(req: Request): number {
        return parseInt(req.session["user"]._id);
    }

    public static getPrefixPage(req: Request): string {
        return this.isEtudiant(req) ? "etudiant" : "enseignant";
    }

    public static hasAccess(req: Request) {
        if (this.isPublicFile(req))
            return true;
        if (this.isLoggedIn(req)) {
            return req.url == "/" || req.url == "/api/v1/logout" ||
                (this.isEtudiant(req) && req.url.startsWith("/etudiant/")) ||
                (!this.isEtudiant(req) && req.url.startsWith("/enseignant/"));
        }
        else
            return false;
    }

    public static isPublicFile(req: Request): boolean {
        return req.url.startsWith("/lib") || req.url.startsWith("/css");
    }
}