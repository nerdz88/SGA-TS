import {SGBService} from "../service/SGBService";
import {LocalStorageHelper} from "./LocalStorageHelper";
const cron = require('node-cron');
export class ProxyServiceHelper {

    static task;

    public static async ajouterNoteEtudiantService(token: string, idEspaceCours: number, type: string, type_id : number, note: number, studentId: number) {
        // Si la reponse recu du SGBService est false, donc il y a eu un Error 500 ou un Timeout, nous allons stocker
        // donnees dans une db JSON
        let response = await SGBService.ajouterNoteEtudiant(token, idEspaceCours, type, type_id, note, studentId);
        if (response == null){
            // once we persist data we should start a scheduled job on another thread
            // that periodically, tries to push the data
            this.scheduleSGBFallbackJob();
            this.persistData(token, idEspaceCours, type, type_id, note, studentId);
        }
        return response;
    }

    public static persistData(token: string, idEspaceCours: number, type: string, type_id : number, note: number, studentId: number){
        let noteDevoirJSON = {
            "token": token,
            "idEspaceCours": idEspaceCours,
            "type": type,
            "type_id" : type_id,
            "note": note,
            "studentId": studentId
        };

        LocalStorageHelper.pushData(noteDevoirJSON);
    }

    public static getTasks(){
        return cron.getTasks();
    }

    public static scheduleSGBFallbackJob() {
        this.task = cron.schedule('*/1 * * * *', async function() {
            console.log('Attempting to send SGB request');
            for (let i = 0; i < LocalStorageHelper.getDataCount(); i++){
                let noteDevoir = LocalStorageHelper.getData(i);
                if (noteDevoir != null) {
                    let response = await SGBService.ajouterNoteEtudiant(noteDevoir.token, noteDevoir.idEspaceCours, noteDevoir.type, noteDevoir.type_id, noteDevoir.note, noteDevoir.studentId);
                    if (response == null){
                        //We return and keep the cron scheduler going
                        return;
                    }
                }
            }
            // Once we're done, we cancel the CRON and we empty the local DB
            LocalStorageHelper.clearData();
            // sa sert a rien de le destroy honnetement, mais wtv
            this.task.destroy();
        });
    }
}