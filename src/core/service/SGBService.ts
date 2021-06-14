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
        const reponse = await fetch(this.baseUrlV2 + "login?email=" + encodeURIComponent(username) + "&password=" + password,);
        if(reponse.status != 200) {
            throw new SgbError("Erreur lors du login")
        }
        return await reponse.json();
    }

    public static async recupererJsonCours(params: any) {
        const reponse = await fetch(this.baseUrlV1 + "courses", { headers: { token: params.token } })
        if(reponse.status != 200) {
            throw new SgbError("Erreur lors du fetch courses")
        }
        return await reponse.json();;
    }

    public static async recupererEtudiant(typeJson: string, id: number, token?: string) {
        const reponse = await fetch(this.baseUrlV1 + "course/" + id + "/students",
            { headers: { token: token } });
        if(reponse.status != 200) {
            throw new SgbError("Erreur lors du fetch etudiant")
        }
        return await reponse.json();
    }
}