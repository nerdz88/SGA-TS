import { NotFoundError } from '../errors/NotFoundError';
import {Cours} from '../model/Cours';
import fetch = require('node-fetch');
import { GroupeCours } from '../model/GroupeCours';
import {Operation} from './Operation';
export class SGBService{
    public static async recupererJsonCours(params: any){
        const reponse = await fetch("http://127.0.0.1:3001/api/v1/courses", { headers: { token: params.token } })
        const  json = await reponse.json();
        return json;
    }

    public static async recupererEtudiant(params : any){
        const reponse = await fetch("http://127.0.0.1:3001/api/v1/course/"+ params.id + "/students",
        { headers: { token: params.token } })
        const json = await reponse.json()
        return json.data;
    }
}