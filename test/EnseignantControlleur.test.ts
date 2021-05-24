import * as supertest from "supertest";
import 'jest-extended';
import app from '../src/App';
import { getMaxListeners } from "process";

const request = supertest(app);

let tokenEnseignant = "e44cd054a9b7f4edee4f1f0ede5ee704";

describe('GET /api/v1/sga/recupererCours', () => {

    it('responds with successful first call for teacher email ' + tokenEnseignant, async () => {
        const response = await request.get('/api/v1/sga/recupererCours/'+tokenEnseignant);
        expect(response.status).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.text).toInclude('\"_sigle\":\"LOG210\"');
        expect(response.text).toInclude('\"_id\":1');
        expect(response.text).toInclude('\"_nb_max_student\":5');
        expect(response.text).toInclude('\"_groupe\":\"01\"')
        expect(response.text).toInclude('\"_titre\":\"Analyse et conception de logiciels\"');
        expect(response.text).toInclude('\"_date_debut\":\"2019-09-01\"');
        expect(response.text).toInclude('\"_date_fin\":\"2019-09-02\"');
    });
});
