import { Request } from 'express';
import { User } from '../model/User';


export class AuthorizationHelper {
    public static isLoggedIn(req: Request): boolean {
        return req.session["token"] != undefined;
    }

    public static getCurrentToken(req: Request): string {
        return req.session["token"];
    }

    public static getCurrentUserInfo(req: Request): User {
        return req.session["user"];
    }
}