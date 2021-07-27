import {SGBService} from "../service/SGBService";
import {LocalStorageHelper} from "./LocalStorageHelper";

export class ProxyServiceHelper {

    public static async ajouterNoteEtudiantService(token: string, idEspaceCours: number, type: string, type_id : number, note: number, studentId: number) {
        this.persistData(idEspaceCours, type, type_id, note, studentId);
        let response = await SGBService.ajouterNoteEtudiant(token, idEspaceCours, type, type_id, note, studentId);
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

}