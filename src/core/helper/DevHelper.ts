
import { Request } from 'express';
import { universite } from '../../App'
import * as fs from 'fs';
import { AuthorizationHelper } from './AuthorizationHelper';
import { serialize, deserialize } from 'class-transformer';
import { Universite } from '../service/Universite';

//Petite classe d'aide pour facilité le dev    
export class DevHelper {
    private static DEV_LOGIN = "dev";
    private static DEV_IMPERSONALISATION: string = "teacher+3@gmail.com"
    private static PATH_DATA = "./src/data/universite.json";


    public static login(req: Request): string {
        var email = req.body.email;

        if (email != this.DEV_LOGIN)
            return email;

        req.session["isDevLoggedIn"] = true;
        this.loadData();
        return this.DEV_IMPERSONALISATION;
    }

    public static loadData() {
        fs.readFile(this.PATH_DATA, (err, data) => {
            if (!err) {
                let universiteLoaded = deserialize(Universite, data.toString());
                universite.setUniversite(universiteLoaded);
                console.log("DevHelper - Universite loaded");
            }
        });
    }


    public static saveData(req: Request) {
        if (!AuthorizationHelper.isDevLoggedIn(req))
            return;
        fs.writeFile(this.PATH_DATA, serialize(universite), function (err) {
            if (!err) {
                console.log("DevHelper - Universite saved");
            }
        });
    }

}