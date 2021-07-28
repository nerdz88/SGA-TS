
import { deserialize, serialize } from 'class-transformer';
import { Request } from 'express';
import * as fs from 'fs';
import { universite } from '../../App';
import { Universite } from '../service/Universite';
import { AuthorizationHelper } from './AuthorizationHelper';

//Petite classe d'aide pour facilité le dev    
export class DevHelper {
    private static DEV_LOGIN = "dev";
    private static DEV_IMPERSONALISATION: string = "teacher+3@gmail.com"
    private static PATH_DATA = "./src/data/cache/universite.json";

    public static login(req: Request, filename?: string): string {
        var email = req.body.email;

        if (email != this.DEV_LOGIN)
            return email;

        req.session["isDevLoggedIn"] = true;
        this.loadData(filename || this.PATH_DATA);
        return this.DEV_IMPERSONALISATION;
    }

    public static loadData(filename: string) {

        try {
            let data = fs.readFileSync(filename || this.PATH_DATA);
            let universiteLoaded = deserialize(Universite, data.toString());
            universite.setUniversite(universiteLoaded);
            console.log("DevHelper - Universite loaded");
        } catch (e) {
            console.error(e);
        }
    }

    public static saveData(req: Request, filename?: string) {
        if (!AuthorizationHelper.isDevLoggedIn(req))
            return;
        try {
            fs.writeFileSync(filename || this.PATH_DATA, serialize(universite));
        } catch (e) {
            console.error(e);
        }
    }

    public static isTestingJest() {
        return process.env.JEST_WORKER_ID !== undefined;
    }

}