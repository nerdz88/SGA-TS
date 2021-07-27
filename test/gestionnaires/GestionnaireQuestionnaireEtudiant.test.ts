import supertestSession from "supertest-session"
import 'jest-extended';
import { SGBService } from "../../src/core/service/SGBService";
import { SgbError } from "../../src/core/errors/SgbError";
import app, { universite } from "../../src/App";

var session = require("supertest-session")
var request = session(app)
var authenticatedSession;
const COURSEVALUE1 = {"_id":1,"_sigle":"LOG210","_nb_max_student":5,"_groupe":"01","_titre":"Analyse et conception de logiciels","_date_debut":"2019-09-01","_date_fin":"2019-09-02","_disponible":true};
const QUESTION1 = '{"typeQuestion":"question-vrai-faux","description":"sdsdsd","tags":"sdsd","nom":"sdsdsd","idEspaceCours":"1","reponses":[{"reponse":true,"descriptionReponse":"","descriptionMauvaiseReponse":""}]}';
const QUESTIONNAIRE1 = '{"idEspaceCours":"1","estModification":"false","idQuestionnaire":"","nom":"sdssd","description":"sdsd","status":"on"}'
const REPONSEQUESTIONNAIRE={"idEspaceCours":"1","idQuestionnaire":"1","indexQuestion":"0","nbQuestions":"1","idQuestion":"1","reponse":"on"}

beforeAll((done) => {
    request.post("/api/v1/login")
        .send({ email: "student+1@gmail.com", password: "" })
        .end(function (err) {
            if (err) return done(err);
            authenticatedSession = request
            return done();
        })

})

afterEach(function () {
    universite.reset();
});

describe('Test ajouter un Questionnaire', () => {

    it("Devrais ajouter le questionnaire avec tous les details",async () => {
        await universite.ajouterEspaceCours(COURSEVALUE1,"e44cd054a9b7f4edee4f1f0ede5ee704",1)
        expect(universite.recupererTousEspaceCours(1).length).toBe(1)
        let espaceCours=universite.recupererUnEspaceCours(1)
        espaceCours.ajouterQuestion(QUESTION1)
        espaceCours.ajouterQuestionnaire(QUESTIONNAIRE1)
        let q = espaceCours.recupererUneQuestion(1);
        espaceCours.recupererUnQuestionnaire(1).ajouterQuestion(q);
        expect(espaceCours.recupererUnQuestionnaire(1).getQuestions().length).toBe(1)

        let reponse = await authenticatedSession.post("/api/v1/etudiant/questionnaire/question/save/1/1/1").send(REPONSEQUESTIONNAIRE);
        
        expect(reponse.status).toBe(200)
        expect(reponse.body.message).toContain("Success")
    })

})
