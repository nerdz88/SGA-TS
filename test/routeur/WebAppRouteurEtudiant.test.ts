import * as supertest from "supertest";
import 'jest-extended';
import app from '../../src/App';
import { TypeQuestion } from "../../src/core/model/TypeQuestion";

var session = require('supertest-session');
var testSession = session(app);

let idEspaceCours = "3";
let idQuestionnaire = "1";
let idDevoir = "1";
let indexQuestion = "1";

let pathPages = [
    {path: "/", titre: "Bonjour firstname1"},
    {path: `/etudiant/cours/detail/${idEspaceCours}`, titre: "Détail Espace Cours"},
    {path: `/etudiant/devoir/${idDevoir}`, titre: "Devoir pour "},
    {path: `/etudiant/questionnaire/${idQuestionnaire}`, titre: "Devoir pour "},
    {path: `/etudiant/questionnaire/afficher/${idEspaceCours}/${idEspaceCours}`, titre: "Devoir pour "},
    {path: `/etudiant/questionnaire/afficher/${idEspaceCours}/${idEspaceCours}/${indexQuestion}`, titre: "Devoir pour "},
]

var authenticatedSessionEtudiant;
beforeAll((done) => {
    testSession.post('/api/v1/login')
        .send({ email: 'student+1@gmail.com', password: '123' })
        .expect(200)
        .end(function (err) {
            if (err) return done(err);
            authenticatedSessionEtudiant = testSession;
            return done();
        });
});

describe('Webapp routeur test PAGE', () => {
    pathPages.forEach((value) => {
        it("RécupérerPage==> " + value.path, async (done) => {
            let response = await authenticatedSessionEtudiant.get(value.path);
            expect(response.status).toBe(200);
            expect(response.type).toContain("text/html");
            expect(response.text).toContain(value.titre);
            done();
        });
    });
});