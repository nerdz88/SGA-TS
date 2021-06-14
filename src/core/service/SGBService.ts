import fetch = require('node-fetch');
/**
 * Peut-être lui trouver un nom plus significatif que SGBService
 * C'est juste des call aux antpoint du SGB peut-être SGBUtil ou qqchose du genre...
 */
export class SGBService {
    private static baseUrlV1: string = "http://127.0.0.1:3001/api/v1/";
    private static baseUrlV2: string = "http://127.0.0.1:3001/api/v2/";

    public static async login(username: string, password: string) {
        const response = await fetch(this.baseUrlV2 + "login?email=" + encodeURIComponent(username) + "&password=" + password,);
        return await response.json();
    }

    public static async recupererJsonCours(params: any) {
        const reponse = await fetch(this.baseUrlV1 + "courses", { headers: { token: params.token } })
        return await reponse.json();;
    }

    public static async recupererEtudiant(typeJson: string, id: number, token?: string) {
        const reponse = await fetch(this.baseUrlV1 + "course/" + id + "/students",
            { headers: { token: token } });
        return await reponse.json();
    }
}