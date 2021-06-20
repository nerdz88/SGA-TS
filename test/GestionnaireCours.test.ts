import * as supertest from "supertest";
import 'jest-extended';
import app, { universite } from '../src/App';
var session = require('supertest-session');
var testSession = session(app);


const COURSEVALUE1 = '{"_id":1,"_sigle":"LOG210","_nb_max_student":5,"_groupe":"01","_titre":"Analyse et conception de logiciels","_date_debut":"2019-09-01","_date_fin":"2019-09-02"}';
//const COURSEVALUE2 = '{"_id":1,"_sigle":"LOG210","_nb_max_student":5,"_groupe":"01","_titre":"Analyse et conception de logiciels","_date_debut":"2019-09-01","_date_fin":"2019-09-02"}';

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

afterEach(function () {
    universite.reset();
});

describe('Test gestionnaire des cours - Ajouter', () => {
    it("Ajouter cours POST  /api/v1/enseignant/cours/ajouter", async (done) => {
        let response = await authenticatedSession.post('/api/v1/enseignant/cours/ajouter')
            .send({ data: COURSEVALUE1 });

        expect(response.status).toBe(201);
        expect(response.type).toBe("application/json");
        expect(response.body.idEspaceCours).toBe(1);
        done();
    });

    it("Ajouter 2 fois le même cours POST /api/v1/enseignant/cours/ajouter", async (done) => {
        let response = await authenticatedSession.post('/api/v1/enseignant/cours/ajouter')
            .send({ data: COURSEVALUE1 });

        expect(response.status).toBe(201);
        expect(response.type).toBe("application/json");
        expect(response.body.idEspaceCours).toBe(1);

        response = await authenticatedSession.post('/api/v1/enseignant/cours/ajouter')
            .send({ data: COURSEVALUE1 });

        expect(response.status).toBe(400);
        expect(response.type).toBe("application/json");
        expect(response.body.error).toContain("existe déjà");
        done();
    });
});

describe('Test gestionnaire des cours - Récupérer Tous les espaces cours', () => {

    it("Récupérer Tous les EspaceCours Vide GET /api/v1/enseignant/cours", async (done) => {
        authenticatedSession.get('/api/v1/enseignant/cours')
            .end(function (err, res) {
                expect(res.status).toBe(200);
                expect(res.type).toBe("application/json");
                expect(res.body.espaceCours.length).toBe(0);
                done();
            });
    });

    it("Récupérer Tous les EspaceCours 1 éléments /api/v1/enseignant/cours/ajouter", async (done) => {
        let response = await authenticatedSession.post('/api/v1/enseignant/cours/ajouter')
            .send({ data: COURSEVALUE1 });
        expect(response.status).toBe(201);
        expect(response.type).toBe("application/json");
        expect(response.body.idEspaceCours).toBe(1);

        authenticatedSession.get('/api/v1/enseignant/cours')
            .end(function (err, res) {
                expect(res.status).toBe(200);
                expect(res.type).toBe("application/json");
                expect(res.body.espaceCours.length).toBe(1);
                let coursInput = JSON.parse(COURSEVALUE1);
                let coursRes = res.body.espaceCours[0];

                expect(coursRes._id).toBe(coursInput._id);
                expect(coursRes._numero).toBe(coursInput._groupe);
                expect(coursRes._cours._sigle).toBe(coursInput._sigle);
                expect(coursRes._cours._titre).toBe(coursInput._titre);
                expect(coursRes._cours._nbMaxEtudiant).toBe(coursInput._nb_max_student);
                expect(coursRes._dateDebut).toBe(coursInput._date_debut);
                expect(coursRes._dateFin).toBe(coursInput._date_fin);
                expect(coursRes._etudiants.length).toBeGreaterThan(0);

                done();
            });
    });
});

describe('Test gestionnaire des cours - Récupérer 1 espaces cours', () => {

    it("Récupérer un EspaceCours Vide GET /api/v1/enseignant/cours/detail/:id", async (done) => {
        authenticatedSession.get('/api/v1/enseignant/cours/detail/1')
            .end(function (err, res) {
                expect(res.status).toBe(404);
                expect(res.type).toBe("application/json");
                expect(res.body.error).toContain("n'existe pas");
                done();
            });
    });

    it("Récupérer un EspaceCours 1 éléments /api/v1/enseignant/cours/detail/:id", async (done) => {
        let response = await authenticatedSession.post('/api/v1/enseignant/cours/ajouter')
            .send({ data: COURSEVALUE1 });
        expect(response.status).toBe(201);
        expect(response.type).toBe("application/json");
        expect(response.body.idEspaceCours).toBe(1);

        authenticatedSession.get('/api/v1/enseignant/cours/detail/1')
            .end(function (err, res) {
                expect(res.status).toBe(200);
                expect(res.type).toBe("application/json");

                let coursInput = JSON.parse(COURSEVALUE1);
                let coursRes = res.body.espaceCours;

                expect(coursRes._id).toBe(coursInput._id);
                expect(coursRes._numero).toBe(coursInput._groupe);
                expect(coursRes._cours._sigle).toBe(coursInput._sigle);
                expect(coursRes._cours._titre).toBe(coursInput._titre);
                expect(coursRes._cours._nbMaxEtudiant).toBe(coursInput._nb_max_student);
                expect(coursRes._dateDebut).toBe(coursInput._date_debut);
                expect(coursRes._dateFin).toBe(coursInput._date_fin);
                expect(coursRes._etudiants.length).toBeGreaterThan(0);

                done();
            });
    });
});

describe('Test gestionnaire des cours - Supprimer 1 espaces cours', () => {
    it("Supprimer un EspaceCours Vide DELETE /api/v1/enseignant/cours/supprimer/:id", async (done) => {
        authenticatedSession.delete('/api/v1/enseignant/cours/supprimer/1')
            .end(function (err, res) {
                expect(res.status).toBe(404);
                expect(res.type).toBe("application/json");
                expect(res.body.error).toContain("Le cours n'a pas été supprimé");
                done();
            });
    });

    it("Supprimer un EspaceCours 1 DELETE /api/v1/enseignant/cours/supprimer/:id", async (done) => {

        let response = await authenticatedSession.post('/api/v1/enseignant/cours/ajouter')
            .send({ data: COURSEVALUE1 });
        expect(response.status).toBe(201);
        expect(response.type).toBe("application/json");
        expect(response.body.idEspaceCours).toBe(1);

        authenticatedSession.delete('/api/v1/enseignant/cours/supprimer/1')
            .end(function (err, res) {
                expect(res.status).toBe(200);
                expect(res.type).toBe("application/json");
            });

        authenticatedSession.get('/api/v1/enseignant/cours/detail/1')
            .end(function (err, res) {
                expect(res.status).toBe(404);
                expect(res.type).toBe("application/json");
                expect(res.body.error).toContain("n'existe pas");
                done();
            });
    });

});




