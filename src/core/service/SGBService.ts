import fetch = require('node-fetch');
/**
 * Peut-être lui trouver un nom plus significatif que SGBService
 * C'est juste des call aux antpoint du SGB peut-être SGBUtil ou qqchose du genre...
 */
export class SGBService {
    public static async recupererJsonCours(params: any) {
        const reponse = await fetch("http://127.0.0.1:3001/api/v1/courses", { headers: { token: params.token } })
        const json = await reponse.json();
        return json;
    }

    public static async recupererEtudiant(typeJson: string, id: number, token?: string) {
        const reponse = await fetch("http://127.0.0.1:3001/api/v1/course/" + id + "/students",
            { headers: { token: token } })
        const json = await reponse.json()
        return json;
    }
}