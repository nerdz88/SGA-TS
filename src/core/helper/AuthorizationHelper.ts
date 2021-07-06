import { Request } from 'express';


export class AuthorizationHelper {
    public static isLoggedIn(req: Request): boolean {
        return req.session["token"] != undefined;
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

    public static getIdUser(req : Request): number{
        return parseInt(req.session["user"]._id);
    }
}