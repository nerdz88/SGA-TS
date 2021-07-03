import 'jest-extended';
import app, { universite } from "../../src/App";

var session = require("supertest-session")
var request =  session(app)
var authenticatedSession;
const COURSEVALUE1 = '{"_id":1,"_sigle":"LOG210","_nb_max_student":5,"_groupe":"01","_titre":"Analyse et conception de logiciels","_date_debut":"2019-09-01","_date_fin":"2019-09-02"}'
const COURSEVALUE2 = '{"_id":2,"_sigle":"LOG210","_nb_max_student":5,"_groupe":"02","_titre":"Analyse et conception de logiciels","_date_debut":"2019-09-02","_date_fin":"2019-09-03"}'
const QUESTION1 = '{"idEspaceCours":"1","estModification":"false","idQuestion":"","nom":"Question1","tags":"q1,q2","description":"description","descriptionReponse":"Bravo","descriptionMauvaiseReponse":"Fail","reponse":"true"}';
const QUESTION2 = '{"idEspaceCours":"2","estModification":"false","idQuestion":"","nom":"Question2","tags":"q3,q4","description":"description","descriptionReponse":"Bravo","descriptionMauvaiseReponse":"Fail","reponse":"false"}';

beforeAll((done)=>{
    request.post("/api/v1/login")
            .send({email: "teacher+1@gmail.com", password: ""})
            .end(function(err) {
                if(err) return done(err);
                authenticatedSession=request
                return done();
            })
})

afterEach(function () {
    universite.reset();
});

describe('Ajouter une question', ()=> {

    it("Ajouter une question a un groupe cour", async()=>{
        await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({data: COURSEVALUE1})

        const reponse = await authenticatedSession.post("/api/v1/enseignant/question/ajouter/1")
                                .send(JSON.parse(QUESTION1))
        expect(reponse.status).toBe(201)
        expect(reponse.body.message).toContain("Success")

    })
})

describe('Details questions', ()=> {
    it("Obtenir les details d'une question", async()=> {

        await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({data: COURSEVALUE1})

        const reponse = await authenticatedSession.post("/api/v1/enseignant/question/ajouter/1")
                                .send(JSON.parse(QUESTION1))
        expect(reponse.status).toBe(201)
        expect(reponse.body.message).toContain("Success")

        const get = await authenticatedSession.get("/api/v1/enseignant/question/detail/1/1")
        expect(get.status).toBe(200)
        expect(get.body.message).toContain("Success")
        expect(get.body.question._idEspaceCours).toBe("1")
        expect(get.body.question._id).toBe(1)
        expect(get.body.question._nom).toContain("Question1")
        expect(get.body.question._tags[0]).toContain("q1")
        expect(get.body.question._tags[1]).toContain("q2")
        expect(get.body.question._descriptionQuestion).toContain("description")
        expect(get.body.question._descriptionReponse).toContain("Bravo")
        expect(get.body.question._mauvaiseReponseDescription).toContain("Fail")
        expect(get.body.question._reponse).toBeTrue

    })
})

describe('Recuperer toutes questions', ()=> {
    it("Recuperer toutes les questions du SGA",async()=>{

        await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({data: COURSEVALUE1})
        await authenticatedSession.post("/api/v1/enseignant/question/ajouter/1")
        .send(JSON.parse(QUESTION1))
        await authenticatedSession.post("/api/v1/enseignant/question/ajouter/1")
                                .send(JSON.parse(QUESTION2))

        const reponse = await authenticatedSession.get("/api/v1/enseignant/question")
        expect(reponse.status).toBe(200)
        expect(reponse.body.message).toContain("Success")
        expect(reponse.body.data.questions).toBeArrayOfSize(2)

    })
})

describe('Recuperer question espace cours', ()=> {
    it("Recuperer question d'un espace cours", async()=>{

        await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({data: COURSEVALUE1})
        await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({data: COURSEVALUE2})
        await authenticatedSession.post("/api/v1/enseignant/question/ajouter/1")
                                .send(JSON.parse(QUESTION1))
        await authenticatedSession.post("/api/v1/enseignant/question/ajouter/2")
                                .send(JSON.parse(QUESTION2))


        const reponse = await authenticatedSession.get("/api/v1/enseignant/question/2")
        const question = reponse.body.data.questions[0]

        expect(reponse.status).toBe(200)
        expect(reponse.body.message).toContain("Success")
        expect(question._idEspaceCours).toBe("2")
        expect(question._id).toBe(2)

    })
})

describe('Modifier question', ()=> {
    it("Modifier une question d'un espace cours", async()=> {

        await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({data: COURSEVALUE1})
        await authenticatedSession.post("/api/v1/enseignant/question/ajouter/1")
                                .send(JSON.parse(QUESTION1))
        
        const reponse = await authenticatedSession.post("/api/v1/enseignant/question/modifier/1/1").send(JSON.parse(QUESTION2))

        expect(reponse.status).toBe(200)
        expect(reponse.body.message).toContain("Success")

        const question = await authenticatedSession.get("/api/v1/enseignant/question/1")
        const questionData = question.body.data.questions[0]
        expect(questionData._id).toBe(1)
        expect(questionData._nom).toContain("Question2")

    })
})

describe('Supprimer question', ()=> {
    it("Supprimer une question", async()=> {

        await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({data: COURSEVALUE1})
        await authenticatedSession.post("/api/v1/enseignant/question/ajouter/1")
                                .send(JSON.parse(QUESTION1))
        const reponse = await authenticatedSession.delete("/api/v1/enseignant/question/supprimer/1/1")

        expect(reponse.status).toBe(200)
        expect(reponse.body.message).toContain("Success")

        const verification = await authenticatedSession.get("/api/v1/enseignant/question/")

        expect(verification.status).toBe(200)
        expect(verification.body.data.questions).toBeEmpty

    })

})