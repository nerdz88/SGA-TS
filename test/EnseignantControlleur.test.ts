import * as supertest from "supertest";
import 'jest-extended';
import app from '../src/App';

const request = supertest(app);

let tokenEnseignant = "e44cd054a9b7f4edee4f1f0ede5ee704"
let email = "teacher%2B1%40gmail.com"
let password = ""
let sessionCookie

beforeAll(async () => {
    const reponse = await request.get('/api/v1/sga/login/?email='+email+'&password='+password)
    sessionCookie = reponse.get("Set-Cookie")[0].split(';')[0]
});

describe('GET /api/v1/sga/recupererCours', () => {

    it("repond par un appel avec succes et l'information des cours de l'enseignant ", async () => {
        const reponse = await request.get('/api/v1/sga/enseignant/cours').set('Cookie', 'loggedIn=true;'+sessionCookie)                                                                        
        expect(reponse.status).toBe(200); 
    });

    it("repond par un appel avec succes de la page d'accueil", async() => {
        const reponse = await request.get('api/v1/sga/enseignant/accueil')
        expect(reponse.status).toBe(200);
    })

    it("repond par un appel avec succes pour ajouter une aller a la page d'ajout de cours", async () => {
        const reponse = await request.get('api/v1/sga/enseignant/cours/ajouter').set('Cookie', 'loggedIn=true;'+sessionCookie)
        expect(reponse.status).toBe(200);
    })
    it("repond par un appel avec succes pour ajouter une aller a la page des cours", async () => {
        const reponse = await request.get('api/v1/sga/enseignant/cours').set('Cookie', 'loggedIn=true;'+sessionCookie)
        expect(reponse.status).toBe(200);
    })
    it("repond par un appel avec succes pour ajouter un groupe cours dans le SGA", async () => {
        const reponse = await request.get('api/v1/sga/enseignant/cours/ajouter/1').set('Cookie', 'loggedIn=true;'+sessionCookie)
        expect(reponse.status).toBe(200);
    })
    it("repond par un appel avec succes pour avoir les details d'un groupe cours", async() =>{
        const reponse = await request.get('api/v1/sga/enseignant/cours/1/detail').set('Cookie', 'loggedIn=true;'+sessionCookie)
        expect(reponse.status).toBe(200); 
    })
    
});
