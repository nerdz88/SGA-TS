import * as supertest from "supertest";
import 'jest-extended';
import app from '../src/App';
import { getMaxListeners } from "process";

const request = supertest(app);

let tokenEnseignant = "e44cd054a9b7f4edee4f1f0ede5ee704";
let email = "teacher+1@gmail.com"
let password = "";

describe('GET /api/v1/sga/recupererCours', () => {

    it("repond par un appel avec succes et l'information des cours de l'enseignant"  + tokenEnseignant, async () => {
        const reponse = await request.get('/api/v1/sga/recupererCours/'+tokenEnseignant);
        expect(reponse.status).toBe(200);
        expect(reponse.type).toBe("application/json");
        expect(reponse.text).toInclude('\"_sigle\":\"LOG210\"');
        expect(reponse.text).toInclude('\"_id\":1');
        expect(reponse.text).toInclude('\"_nb_max_student\":5');
        expect(reponse.text).toInclude('\"_groupe\":\"01\"')
        expect(reponse.text).toInclude('\"_titre\":\"Analyse et conception de logiciels\"');
        expect(reponse.text).toInclude('\"_date_debut\":\"2019-09-01\"');
        expect(reponse.text).toInclude('\"_date_fin\":\"2019-09-02\"');
    });

    it("repond par un appel avec succes et retourne le token de l'enseignant" + email, async() => {
        const reponse = await request.get('/api/v1/sga/login/'+email+'&'+password)
        expect(reponse.status).toBe(200);
        expect(reponse.type).toBe("application/json");
        expect(reponse.text).toInclude('e44cd054a9b7f4edee4f1f0ede5ee704')
    })
});
