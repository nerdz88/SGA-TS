import 'jest-extended';
import app, { universite } from '../src/App';
var session = require('supertest-session');
var testSession = session(app);

const COURSEVALUE1 = '{"_id":1,"_sigle":"LOG210","_nb_max_student":5,"_groupe":"01","_titre":"Analyse et conception de logiciels","_date_debut":"2019-09-01","_date_fin":"2019-09-02"}';
const QUESTIONVALUE = '{"idEspaceCours":"1","estModification":"false","idQuestion":"","nom":"sdsd","tags":"LOG","description":"sdsd","descriptionReponse":"sdsd","descriptionMauvaiseReponse":"sdsd","response":"true"}';
var authenticatedSession;
beforeAll((done) => {
    testSession.post('/api/v1/login')
        .send({ email: 'teacher+1@gmail.com', password: '123' })
        .expect(200)
        .end(function (err) {
            if (err) return done(err);
            authenticatedSession = testSession;
            return done();
        });
});

beforeEach(async function () {
    universite.reset();
    await authenticatedSession.post('/api/v1/enseignant/cours/ajouter')
        .send({ data: COURSEVALUE1 });
});


let ajouterQuestionResponse = () => {
    return authenticatedSession.post('/api/v1/enseignant/question/ajouter/1')
        .send({ data: QUESTIONVALUE });
}

describe('Test gestionnaire des questions - Ajouter', () => {
    it("Ajouter question POST  /enseignant/question/ajouter/:id", async (done) => {
        let response = await ajouterQuestionResponse();
        expect(response.status).toBe(201);
        expect(response.type).toBe("application/json");
        expect(response.body.message).toBe("Success")
        done();
    });

    it("Ajouter plusieurs fois la question avec le même nom POST /enseignant/question/ajouter/:id", async (done) => {
        await ajouterQuestionResponse();
        let response = await ajouterQuestionResponse();
        expect(response.status).toBe(400);
        expect(response.type).toBe("application/json");        
        expect(response.body.error.message).toContain("existe déjà");
        done();
    });
});

describe('Test gestionnaire des questions - Récupérer Tous les questions du professeur', () => {

    it("Récupérer Tous les Questions Vide GET /enseignant/question/", async (done) => {
        let response = await authenticatedSession.get('/api/v1/enseignant/question/');
        expect(response.status).toBe(200);
        expect(response.type).toBe("application/json");        
        expect(response.body.message).toBe("Success")
        expect(response.body.data.questions.length).toBe(0)
        done();
    });
});


