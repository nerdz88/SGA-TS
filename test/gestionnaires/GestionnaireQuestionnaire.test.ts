import supertestSession from "supertest-session"
import 'jest-extended';
import { SGBService } from "../../src/core/service/SGBService";
import { SgbError } from "../../src/core/errors/SgbError";
import app, { universite } from "../../src/App";
import { AuthorizationHelper } from "../../src/core/helper/AuthorizationHelper";
import { doesNotReject } from "assert";
import { ECONNRESET } from "constants";
import { GestionnaireQuestionnaire } from "../../src/core/controllers/GestionnaireQuestionnaire";

var session = require("supertest-session")
var request = session(app)
var authenticatedSession;
const COURSEVALUE1 = '{"_id":1,"_sigle":"LOG210","_nb_max_student":5,"_groupe":"01","_titre":"Analyse et conception de logiciels","_date_debut":"2019-09-01","_date_fin":"2019-09-02"}';
const QUESTION1 = '{"idEspaceCours":"1","estModification":"false","idQuestion":"","nom":"Question1","tags":"q1,q2","description":"description","descriptionReponse":"Bravo","descriptionMauvaiseReponse":"Fail","reponse":"true"}';
const QUESTION2 = '{"idEspaceCours":"1","estModification":"false","idQuestion":"","nom":"Question2","tags":"q3,q4","description":"description","descriptionReponse":"Bravo","descriptionMauvaiseReponse":"Fail","reponse":"false"}';
const QUESTIONNAIRE1 = { idEspaceCours: "1", "estModification": "false", idQuestionnaire: "", nom: "Questionnaire1", description: "description1", status: "on" }
const QUESTIONNAIRE2 = { idEspaceCours: "1", "estModification": "false", idQuestionnaire: "", nom: "Questionnaire2", description: "description2", status: "off" }
const QUESTIONNAIREMODIF = { nom: "QuestionnaireModifier", description: "descriptionModifier", status:"off"}

beforeAll((done) => {
    request.post("/api/v1/login")
        .send({ email: "teacher+1@gmail.com", password: "" })
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

    it("Devrais ajouter le questionnaire avec tous les details", async () => {

        await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({ data: COURSEVALUE1 })

        let reponse = await authenticatedSession.post("/api/v1/enseignant/questionnaire/ajouter/1").send(QUESTIONNAIRE1)
        expect(reponse.status).toBe(201)
        expect(reponse.body.message).toContain("Success")
        expect(reponse.body.idQuestionnaire).toBe(1)

        let questionnaire = universite.recupererUnEspaceCours(1).recupererUnQuestionnaire(1)

        expect(questionnaire.getId()).toBe(1)
        expect(questionnaire.getDescription()).toContain("description")
        expect(questionnaire.getNom()).toContain("Questionnaire1")
        expect(questionnaire.getStatus()).toBeTrue

    })

})


describe('Test Recuperer Questionnaires', () => {

    it("Devrais retourner tous les questionnaires", async () => {

        await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({ data: COURSEVALUE1 })
        await authenticatedSession.post("/api/v1/enseignant/questionnaire/ajouter/1").send(QUESTIONNAIRE1)
        await authenticatedSession.post("/api/v1/enseignant/questionnaire/ajouter/1").send(QUESTIONNAIRE2)

        let reponse = await authenticatedSession.get("/api/v1/enseignant/questionnaire/")

        expect(reponse.status).toBe(200)
        expect(reponse.body.message).toContain("Success")
        expect(reponse.body.data.idEspaceCours).toBeEmpty

        expect(reponse.body.data.questionnaires[0]._id).toBe(1)
        expect(reponse.body.data.questionnaires[1]._id).toBe(2)

    })

    it("Devrais retourner les questionnaires de l'espaceCours", async()=>{

        await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({ data: COURSEVALUE1 })
        await authenticatedSession.post("/api/v1/enseignant/questionnaire/ajouter/1").send(QUESTIONNAIRE1)
        await authenticatedSession.post("/api/v1/enseignant/questionnaire/ajouter/1").send(QUESTIONNAIRE2)

        let reponse = await authenticatedSession.get("/api/v1/enseignant/questionnaire/1")

        expect(reponse.status).toBe(200)
        expect(reponse.body.message).toContain("Success")
        expect(reponse.body.data.idEspaceCours).toBe("1")
        expect(reponse.body.data.questionnaires[0]._nom).toContain("Questionnaire1")
        expect(reponse.body.data.questionnaires[1]._nom).toContain("Questionnaire2")
        expect(reponse.body.data.questionnaires).toBeArrayOfSize(2)

    })

})

describe("Test suppression d'un questionnaire", () => {
    it("devrais retirer un questionnaire", async () => {

        await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({ data: COURSEVALUE1 })
        await authenticatedSession.post("/api/v1/enseignant/questionnaire/ajouter/1").send(QUESTIONNAIRE1)

        let reponse = await authenticatedSession.delete("/api/v1/enseignant/questionnaire/supprimer/1/1")

        expect(reponse.status).toBe(200)
        expect(universite.recupererUnEspaceCours(1).recupererToutQuestionnaires()).toBeArrayOfSize(0)

    })
})

describe("Test details d'un questionnaire", () => {


    it("recuperer details d'un questionnaire", async () => {

        await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({ data: COURSEVALUE1 })
        await authenticatedSession.post("/api/v1/enseignant/questionnaire/ajouter/1").send(QUESTIONNAIRE1)

        let reponse = await authenticatedSession.get("/api/v1/enseignant/questionnaire/detail/1/1")
        let questionnaire = reponse.body.questionnaire

        //To be verified for details ???
        expect(reponse.status).toBe(200)
        expect(reponse.body.message).toContain("Success")
        expect(questionnaire._idEspaceCours).toContain("1")
        expect(questionnaire._nom).toContain("Questionnaire1")
        expect(questionnaire._description).toContain("description1")
        expect(questionnaire._status).toContain("on")


    })

})

describe("Test modifier un questionnaire", ()=>{

    it("devrais modifier le questionnaire", async()=> {

        await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({ data: COURSEVALUE1 })
        await authenticatedSession.post("/api/v1/enseignant/questionnaire/ajouter/1").send(QUESTIONNAIRE1)

        let reponse = await authenticatedSession.put("/api/v1/enseignant/questionnaire/modifier/1/1").send(QUESTIONNAIREMODIF)

        expect(reponse.status).toBe(200)
        expect(reponse.body.message).toContain("Success")

        let questionnaire = universite.recupererUnEspaceCours(1).recupererUnQuestionnaire(1)

        expect(questionnaire.getNom()).toContain("QuestionnaireModifier")
        expect(questionnaire.getDescription()).toContain("descriptionModifier")
        expect(questionnaire.getStatus()).toBeFalse

    })

})

describe("Test recupererTagQuestion", ()=>{

    it("Devrais retourner tous les tags d'un espace cours", async()=>{

        await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({ data: COURSEVALUE1 })
        await authenticatedSession.post("/api/v1/enseignant/question/ajouter/1")
                                .send(JSON.parse(QUESTION1))
        await authenticatedSession.post("/api/v1/enseignant/questionnaire/ajouter/1").send(QUESTIONNAIRE1)
        
        let gc = new GestionnaireQuestionnaire(universite)
        let tags = JSON.parse(gc.recupererTagQuestionParEspaceCours(1))

        expect(tags).toBeArrayOfSize(2)
        expect(tags[0]).toContain("q1")


    })

    it("Devrais retourner les ids des questions du questionnaire", async()=>{

        await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({ data: COURSEVALUE1 })
        await authenticatedSession.post("/api/v1/enseignant/question/ajouter/1")
                                .send(JSON.parse(QUESTION1))
        await authenticatedSession.post("/api/v1/enseignant/question/ajouter/1")
                                .send(JSON.parse(QUESTION2))
        await authenticatedSession.post("/api/v1/enseignant/questionnaire/ajouter/1").send(QUESTIONNAIRE1)

        let gc = new GestionnaireQuestionnaire(universite)
        var arrayIdQuestion = "1,2"
        gc.gererQuestionsQuestionnaire(1,1,JSON.stringify(arrayIdQuestion.split(",")))
        let ids = JSON.parse(gc.recupererIdsQuestionsQuestionnaire(1,1))

        expect(ids).toBeArrayOfSize(2)
        expect(ids[0]).toBe(1)
        expect(ids[1]).toBe(2)


    })

})

