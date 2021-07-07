import 'jest-extended';
import app from "../src/App";

var session = require("supertest-session")
var request = session(app)
var authenticatedSession;
const COURSEVALUE1 = '{"_id":1,"_sigle":"LOG210","_nb_max_student":5,"_groupe":"01","_titre":"Analyse et conception de logiciels","_date_debut":"2019-09-01","_date_fin":"2019-09-02"}';
const QUESTION1 = '{"idEspaceCours":"1","estModification":"false","idQuestion":"","nom":"Question1","tags":"q1,q2","description":"description","descriptionReponse":"Bravo","descriptionMauvaiseReponse":"Fail","reponse":"true"}';
const QUESTION2 = '{"idEspaceCours":"1","estModification":"false","idQuestion":"","nom":"Question2","tags":"q3,q4","description":"description","descriptionReponse":"Bravo","descriptionMauvaiseReponse":"Fail","reponse":"false"}';
const QUESTIONNAIRE1 = { idEspaceCours: "1", "estModification": "false", idQuestionnaire: "", nom: "Questionnaire1", description: "description1", status: "on" }
const QUESTIONNAIRE2 = { idEspaceCours: "1", "estModification": "false", idQuestionnaire: "", nom: "Questionnaire2", description: "description2", status: "off" }

beforeAll((done) => {
    request.post("/api/v1/login")
        .send({ email: "teacher+1@gmail.com", password: "" })
        .end(function (err) {
            if (err) return done(err);
            authenticatedSession = request
            return done();
        })

})

beforeAll(async()=>{

    await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({ data: COURSEVALUE1})
    await authenticatedSession.post("/api/v1/enseignant/question/ajouter/1").send(JSON.parse(QUESTION1))
    await authenticatedSession.post("/api/v1/enseignant/question/ajouter/1").send(JSON.parse(QUESTION2))
    await authenticatedSession.post("/api/v1/enseignant/questionnaire/ajouter/1").send(QUESTIONNAIRE1)
    await authenticatedSession.post("/api/v1/enseignant/questionnaire/ajouter/1").send(QUESTIONNAIRE2)
    await authenticatedSession.post("/api/v1/enseignant/questionnaire/question/1/1").send({data: JSON.stringify("1,2")})

})

describe("Test WebAppRouteur", ()=>{


    it("Test Routes pour la vue Cours", async()=>{

        let route1 = await authenticatedSession.get("/enseignant/cours")
        let route2 = await authenticatedSession.get("/enseignant/cours/ajouter")
        let route3 = await authenticatedSession.get("/enseignant/cours/detail/1")

        expect(route1.status).toBe(200)
        expect(route1.type).toContain("text/html")
        expect(route1.text).toContain("Vos Espaces Cours")

        expect(route2.status).toBe(200)
        expect(route2.type).toContain("text/html")
        expect(route2.text).toContain("Ajouter un Espace Cours")

        expect(route3.status).toBe(200)
        expect(route3.type).toContain("text/html")
        expect(route3.text).toContain("Détail Espace Cours")

    })

})