import * as supertest from "supertest";
import 'jest-extended';
import app from '../../src/App';

var session = require('supertest-session');
var testSession = session(app);

let idEspaceCours = "3";
let idQuestionnaire = "1";
let idQuestion = "1";
let idDevoir = "1";

let pathPages = [
    `/`,
    `/enseignant/cours`,
    `/enseignant/cours/ajouter`,
    `/enseignant/cours/detail/${idEspaceCours}`,
    `/enseignant/question/`,
    `/enseignant/question/${idEspaceCours}`,
    `/enseignant/question/detail/${idEspaceCours}/${idQuestion}`,
    `/enseignant/question/ajouter/${idEspaceCours}`,
    `/enseignant/question/modifier/${idEspaceCours}/${idQuestion}`,
    `/enseignant/devoir/${idEspaceCours}`,
    `/enseignant/devoir/detail/${idEspaceCours}/${idDevoir}`,
    `/enseignant/devoir/ajouter/${idEspaceCours}`,
    `/enseignant/devoir/modifier/${idEspaceCours}/${idDevoir}`,
    `/enseignant/questionnaire/`,
    `/enseignant/questionnaire/${idEspaceCours}`,
    `/enseignant/questionnaire/detail/${idEspaceCours}/${idQuestionnaire}`,
    `/enseignant/questionnaire/ajouter/${idEspaceCours}`,
    `/enseignant/questionnaire/modifier/${idEspaceCours}/${idQuestionnaire}`,
    `/enseignant/questionnaire/question/${idEspaceCours}/${idQuestionnaire}`,
]

var authenticatedSession;
beforeAll((done) => {
    testSession.post('/api/v1/login')
        .send({ email: 'dev', password: '123' })
        .expect(200)
        .end(function (err) {
            if (err) return done(err);
            authenticatedSession = testSession;
            return done();
        });
});

describe('Webapp routeur test PAGE', () => {
    pathPages.forEach((path: string) => {
        it("RécupérerPage==> " + path, async (done) => {
            let response = await authenticatedSession.get(path);
            expect(response.status).toBe(200);
            expect(response.type).toContain("text/html");
            done();
        });
    });
});




