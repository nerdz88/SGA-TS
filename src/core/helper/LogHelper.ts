import * as fs from 'fs';
import * as moment from 'moment';
import { DevHelper } from './DevHelper';

export class LogHelper {

    private static PATH_FICHIER_LOG = "./src/data/log/runtime/erreur.txt";
    private static PATH_FICHIER_LOG_TESTING = "./src/data/log/testing/erreur.txt";

    private static createMessage(type: string, name: string, message: string) {
        let dateFormated = (moment(new Date())).format('YYYY-MMM-DD HH:mm:ss')
        return `\r\n[${dateFormated}] [${type}] ${name} - ${message}`;
    }

    public static log(path: string, type: string, name: string, message: string) {
        try {
            fs.appendFileSync(path, this.createMessage(type, name, message));
        } catch (e) {
            //Une erreur mais c'est pas grave
            console.warn(e);
        }
    }

    public static logErreur(code: string, name: string, message: string) {
        var path = DevHelper.isTestingJest() ? this.PATH_FICHIER_LOG_TESTING : this.PATH_FICHIER_LOG;
        this.log(path, `ERROR|${code}`, name, message);
        console.error(message);
    }
}
