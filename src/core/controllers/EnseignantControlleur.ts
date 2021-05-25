import fetch = require('node-fetch');
import {SGA} from "../domaine/SGA";

export class EnseignantControlleur {
    // classe contrôleur GRASP
    private baseUrl: string = "http://127.0.0.1:3001";
    private endPoint: string = "/api/v1/";
    private sga : SGA;

    constructor() {
        this.sga = new SGA();
    }
    public async recupererCours(tokenEnseignant: string) {
        const reponse = await fetch(this.baseUrl + this.endPoint + "courses", { headers: { token: tokenEnseignant } })
        const json = await reponse.json();
        let val=this.sga.buildCours(json.data);
        //TODO essayer de modifier l'affichage avec le nouvelle map de cours qui contient des groupeCours
        //console.log(val);
        /*val.get("LOG210").getGroupeCours().forEach(element => {
            console.log(element);
        });*/
        return json;

    }

    public async recupererDetailCours(tokenEnseignant: string, id: string) {

        const path = "course/" + id + "/students"
        const reponse = await fetch(this.baseUrl + this.endPoint + path, { headers: { token: tokenEnseignant } })
        console.log(reponse);
        const json = await reponse.json()
        return json;

    }

    public async login(username: string, password: string) {

        const reponse = await fetch(this.baseUrl + this.endPoint +
             'login?email='+encodeURIComponent(username)+'&password='+password);
        
            
        const json = await reponse.json();
        return json;
    }

}