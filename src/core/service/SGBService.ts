import fetch = require('node-fetch');
import { SgbError } from '../errors/SgbError';
/**
 * Peut-être lui trouver un nom plus significatif que SGBService
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
                throw new SgbError("Erreur lors du login: " + error.message);
            });
    }

    public static async recupererJsonCours(token: string) {
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


}