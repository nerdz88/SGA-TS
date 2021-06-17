import * as supertest from "supertest";
import 'jest-extended';
import app from '../src/App';
var session = require('supertest-session');
var testSession = session(app);
var authenticatedSession;

//const request = supertest(app);
// let controlleur: GestionnaireCours;
// let universite: Universite;
// const TOKEN = "e44cd054a9b7f4edee4f1f0ede5ee704";
// const COURSEVALUE = '{"_id":1,"_sigle":"LOG210","_nb_max_student":5,"_groupe":"01","_titre":"Analyse et conception de logiciels","_date_debut":"2019-09-01","_date_fin":"2019-09-02"}';
// const RECEIVEDSTRING = '[{\"_titre\":\"Analyse et conception de logiciels\",\"_sigle\":\"LOG210\",\"_nbMaxEtudiant\":5';


beforeEach(function (done) {
    testSession.post('/api/v1//login')
        .send({ email: 'teacher+1@gmail.com', password: '123' })
        .expect(200)
        .end(function (err) {
            if (err) return done(err);
            authenticatedSession = testSession;
            return done();
        });
});

describe('Test gestionnaire des cours', () => {
    it("Get /api/v1/enseignant/cours", async (done) => {
        authenticatedSession.get('/api/v1/enseignant/cours')
            .expect(200)
            .end(done)
    });
});





/*
describe('Test gestionnaire des cours', () => {
    it("ajouter un cours devrait mettre à jour la liste des cours de l'université",async() =>{
        await controlleur.ajouterCours(COURSEVALUE,TOKEN)
        expect(controlleur.recupererCours()).toContain(RECEIVEDSTRING)
    })

    it("Recuperer un cours d'une liste vide vrai retourner un array vide",async() =>{
        expect(controlleur.recupererCours()).toContain("[]")
    })

    it("Supprimer un cours devrais enlever l'element",async()=> {

        await controlleur.ajouterCours(COURSEVALUE,TOKEN)
        expect(controlleur.recupererCours()).toBeDefined

        await controlleur.supprimerCours("LOG210",1)
        expect(controlleur.recupererCours()).toContain("[]")

    })
    it("recuperer GroupeCours par Sigle",async()=> {
        await controlleur.ajouterCours(COURSEVALUE,TOKEN)
        expect(controlleur.recupererCours()).toBeDefined;
        expect(controlleur.recupererGroupeCoursBySigle("LOG210")).toContain('"_sigle":"LOG210"')
    })
});*/
