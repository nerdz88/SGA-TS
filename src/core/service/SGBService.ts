// import { NotFoundError } from "../errors/NotFoundError";
// import { AlreadyExistsError } from "../errors/AlreadyExistsError";
// import fetch = require('node-fetch');
// import { Application, Request, Response } from 'express'

// //Service pour tous les call vers le SGB
// export class SGBService {

//     private baseUrl: string = "http://127.0.0.1:3001";
//     private endPoint: string = "/api/v1/";

//     public async recupererCours(tokenEnseignant: string) {
//         const reponse = await fetch(this.baseUrl + this.endPoint + "courses", { headers: { token: tokenEnseignant } })
//         const json = await reponse.json();
//         return json;
//     }

//     public async recupererDetailCours(tokenEnseignant: string, id: string) {
//         const path = "course/" + id + "/students"
//         const reponse = await fetch(this.baseUrl + this.endPoint + path, { headers: { token: tokenEnseignant } })
//         console.log(reponse);
//         const json = await reponse.json()
//         return json;
//     }

//     public async login(username: string, password: string) {
//         const reponse = await fetch(this.baseUrl + this.endPoint +
//             'login?email=' + encodeURIComponent(username) + '&password=' + password);

//         const json = await reponse.json();
//         return json;
//     }

// }