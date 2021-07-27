import {SGBService} from "../service/SGBService";
import {LocalStorageHelper} from "./LocalStorageHelper";
const cron = require('node-cron');
export class ProxyServiceHelper {

    public static async ajouterNoteEtudiantService(token: string, idEspaceCours: number, type: string, type_id : number, note: number, studentId: number) {
        // Si la reponse recu du SGBService est false, donc il y a eu un Error 500 ou un Timeout, nous allons stocker
        // donnees dans une db JSON
        let response = await SGBService.ajouterNoteEtudiant(token, idEspaceCours, type, type_id, note, studentId);
        if (!response.ok){
            // once we persist data we should start a scheduled job on another thread
            // that periodically, tries to push the data
            this.scheduleSGBFallbackJob();
            this.persistData(idEspaceCours, type, type_id, note, studentId);
        }
    }

    public static persistData(idEspaceCours: number, type: string, type_id : number, note: number, studentId: number){
        let noteDevoirJSON = {
            "idEspaceCours": idEspaceCours,
            "type": type,
            "type_id" : type_id,
            "note": note,
            "studentId": studentId
        };

        LocalStorageHelper.pushData(noteDevoirJSON);
    }

    private static scheduleSGBFallbackJob() {
        let task = cron.schedule('*/5 * * * *', function() {
            console.log('Attempting to send SGB request');
            let data = LocalStorageHelper.getAllData();
        });
    }
}