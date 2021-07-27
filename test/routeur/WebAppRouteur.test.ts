import * as supertest from "supertest";
import 'jest-extended';
import app from '../../src/App';
import { TypeQuestion } from "../../src/core/model/TypeQuestion";

var session = require('supertest-session');
var testSession = session(app);

let idEspaceCours = "3";
let idQuestionnaire = "1";
let idQuestion = "1";

let pathPages = [
    {path: "/", titre: "Bonjour"},
    {path: `/enseignant/cours`, titre: "Vos Espaces Cours"},
    {path: `/enseignant/cours/ajouter`, titre: "Ajouter un Espace Cours"},
    {path: `/enseignant/cours/detail/${idEspaceCours}`, titre: "Détail Espace Cours"},
    {path: `/enseignant/question/`, titre: "Vos Questions"},
    {path: `/enseignant/question/${idEspaceCours}`, titre: "Questions pour"},
    {path: `/enseignant/question/detail/${idEspaceCours}/${idQuestion}`, titre: "Détail question"},
    //{path: `/enseignant/question/ajouter/${idEspaceCours}/${typeQuestion}`, titre: "Ajouter une question"},
    {path: `/enseignant/question/modifier/${idEspaceCours}/${idQuestion}`, titre: "Modifier une question"},
    {path: `/enseignant/devoir/${idEspaceCours}`, titre: "Devoir pour"},
    //{path: `/enseignant/devoir/detail/${idEspaceCours}/${idDevoir}`, titre: "Détail Devoir"},
    {path: `/enseignant/devoir/ajouter/${idEspaceCours}`, titre: "Ajouter un devoir"},
    //{path: `/enseignant/devoir/modifier/${idEspaceCours}/${idDevoir}`, titre: "Modifier un devoir"},
    {path: `/enseignant/questionnaire/`, titre: "Vos Questionnaires"},
    {path: `/enseignant/questionnaire/${idEspaceCours}`, titre: "Questionnaires pour"},
    {path: `/enseignant/questionnaire/detail/${idEspaceCours}/${idQuestionnaire}`, titre: "Détail Questionnaire"},
    {path: `/enseignant/questionnaire/ajouter/${idEspaceCours}`, titre: "Ajouter un questionnaire"},
    {path: `/enseignant/questionnaire/modifier/${idEspaceCours}/${idQuestionnaire}`, titre: "Modifier un questionnaire"},
    {path: `/enseignant/questionnaire/question/${idEspaceCours}/${idQuestionnaire}`, titre: "Gérer les questions du questionnaire"},
]
for(var type=1;type<=6;type++){
    pathPages.push({path: `/enseignant/question/ajouter/${idEspaceCours}/${type}`, titre: "Ajouter une question"})
}

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
    pathPages.forEach((value) => {
        it("RécupérerPage==> " + value.path, async (done) => {
            let response = await authenticatedSession.get(value.path);
            expect(response.status).toBe(200);
            expect(response.type).toContain("text/html");
            expect(response.text).toContain(value.titre);
            done();
        });
    });
});




