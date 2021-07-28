import fetch = require('node-fetch');
import { SgbError } from '../errors/SgbError';
/**
 * TODO Peut-être lui trouver un nom plus significatif que SGBService
 * C'est juste des call aux antpoint du SGB peut-être SGBUtil ou qqchose du genre...
 */
export class SGBService {
    private static baseUrlV1: string = "http://127.0.0.1:3001/api/v1/";
    private static baseUrlV2: string = "http://127.0.0.1:3001/api/v2/";

    public static async login(username: string, password: string) {
        return fetch(this.baseUrlV2 + "login?email=" + encodeURIComponent(username) + "&password=" + password)
            .then(reponse => {
                if (!reponse.ok) {
                    throw new SgbError("Erreur lors du login");
                }
                return reponse.json();
            })
            .then(data => {
                return data;
            })
            .catch((error: Error) => {
                //Si on est ici, le SGB est surement down
                throw new SgbError("Erreur lors du login SGB: " + error.message);
            });
    }

    public static async recupererGroupesCours(token: string) {
        return fetch(this.baseUrlV1 + "courses", { headers: { token: token } })
            .then(reponse => {
                if (!reponse.ok) {
                    throw new SgbError("Erreur lors du fetch courses");
                }
                return reponse.json();
            })
            .then(data => {
                return data.data;
            })
            .catch((error: Error) => {
                //Si on est ici, le SGB est surement down
                throw new SgbError("Erreur lors du fetch courses " + error.message);
            });
    }

    public static async recupererEtudiant(token: string, idEspaceCours: number) {
        return fetch(this.baseUrlV1 + "course/" + idEspaceCours + "/students", { headers: { token: token } })
            .then(reponse => {
                if (!reponse.ok) {
                    throw new SgbError("Erreur lors du fetch etudiant")
                }
                return reponse.json();
            })
            .then(data => {
                return data.data;
            })
            .catch((error: Error) => {
                //Si on est ici, le SGB est surement down
                throw new SgbError("Erreur lors du fetch etudiant " + error.message);
            });
    }

    public static async ajouterNoteEtudiant(token: string, idEspaceCours: number, type: string, type_id: number, note: number, studentId: number) {
        return fetch(this.baseUrlV1 + "note?student_id=" + studentId + "&" + "course_id=" + idEspaceCours + "&" + "type=" + type + "&" + "type_id=" + type_id + "&" + "note=" + note, { method: 'POST', headers: { token: token } })
            .then(reponse => {
                if (!reponse.ok) {
                    throw new SgbError("Erreur lors du fetch etudiant")
                }
                return reponse;
            })
            .catch((error: Error) => {
                return null;
                //Si on est ici, le SGB est surement down
                //throw new SgbError("Erreur lors de l'ajout de la note de l'etudiant " + error.message);
            });
    }

}