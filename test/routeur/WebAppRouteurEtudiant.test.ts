import 'jest-extended';
import app, { universite } from '../../src/App';

var session = require('supertest-session');
var testSession = session(app);
var anotherSession = require('supertest-session');
var anotherTestSession = anotherSession(app);

const COURSEVALUE1 = '{"_id":1,"_sigle":"LOG210","_nb_max_student":5,"_groupe":"01","_titre":"Analyse et conception de logiciels","_date_debut":"2019-09-01","_date_fin":"2019-09-02"}';
const DEVOIR1 = '{"nom":"devoir1","idEspaceCours":"1","description":"ceci est une description","noteMaximale":"90","dateDebut":"10-10-2019","dateFin":"11-11-2041","visible":"true"}';
const QUESTIONNAIRE1 = { idEspaceCours: "1", "estModification": "false", idQuestionnaire: "", nom: "Questionnaire1", description: "description1", status: "on" }
const QUESTION1 = '{"typeQuestion":"question-vrai-faux","description":"sdsdsd","tags":"sdsd","nom":"sdsdsd","idEspaceCours":"1","reponses":[{"reponse":true,"descriptionReponse":"","descriptionMauvaiseReponse":""}]}';
let idEspaceCours = "1";
let idQuestionnaire = "1";
let idDevoir = "1";
let indexQuestion = "1";

let pathPages = [
    { path: "/", titre: "Bonjour firstname1" },
    { path: `/etudiant/cours/detail/${idEspaceCours}`, titre: "Détail Espace Cours" },
    { path: `/etudiant/devoir/${idDevoir}`, titre: "Devoir pour " },
    { path: `/etudiant/questionnaire/${idQuestionnaire}`, titre: "Système de Gestion des Apprentissages" },
    { path: `/etudiant/questionnaire/afficher/${idEspaceCours}/${idQuestionnaire}`, titre: "Questionnaire" },
    { path: `/etudiant/questionnaire/afficher/${idEspaceCours}/${idQuestionnaire}/${indexQuestion}`, titre: "Questionnaire" },
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


var authenticatedSession
beforeAll((done) => {
    anotherTestSession.post('/api/v1/login')
        .send({ email: 'teacher+1@gmail.com', password: '123' })
        .expect(200)
        .end(function (err) {
            if (err) return done(err);
            authenticatedSession = anotherTestSession;
            return done();
        });
});

beforeAll(async () => {

    await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({ data: COURSEVALUE1 })
    await authenticatedSession.post("/api/v1/enseignant/devoir/ajouter/1").send(JSON.parse(DEVOIR1))
    await authenticatedSession.post("/api/v1/enseignant/questionnaire/ajouter/1").send(QUESTIONNAIRE1)
    let espaceCours = universite.recupererUnEspaceCours(1);
    espaceCours.ajouterQuestion(QUESTION1);
    let q = espaceCours.recupererUneQuestion(1);
    espaceCours.recupererUnQuestionnaire(1).ajouterQuestion(q);

});

describe('Webapp routeur test PAGE', () => {
    pathPages.forEach((value) => {
        it("RécupérerPages==> " + value.path, async (done) => {
            let response = await authenticatedSessionEtudiant.get(value.path);
            expect(response.status).toBe(200);
            expect(response.type).toContain("text/html");
            expect(response.text).toContain(value.titre);
            done();
        });
    });
});