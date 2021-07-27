import { setupMaster } from 'cluster';
import 'jest-extended';
import app, { universite } from "../../src/App";

var session = require("supertest-session")
var request =  session(app)
var authenticatedSession;
const COURSEVALUE1 = '{"_id":1,"_sigle":"LOG210","_nb_max_student":5,"_groupe":"01","_titre":"Analyse et conception de logiciels","_date_debut":"2019-09-01","_date_fin":"2019-09-02"}'
const COURSEVALUE2 = '{"_id":2,"_sigle":"LOG210","_nb_max_student":5,"_groupe":"02","_titre":"Analyse et conception de logiciels","_date_debut":"2019-09-02","_date_fin":"2019-09-03"}'
const QUESTION1 = '{"idEspaceCours":"1","estModification":"false","typeQuestion":"question-vrai-faux","idQuestion":"1","nom":"Question1","tags":"q1,q2","description":"description","descriptionReponse":"Bravo","descriptionMauvaiseReponse":"Fail","reponse":"true","reponses":[{"reponse":"sdsd","descriptionReponse":"sdds","descriptionMauvaiseReponse":"sdsd"}]}';
const QUESTION2 = '{"idEspaceCours":"2","estModification":"false","typeQuestion":"question-vrai-faux","idQuestion":"2","nom":"Question2","tags":"q3,q4","description":"description","descriptionReponse":"Bravo","descriptionMauvaiseReponse":"Fail","reponse":"false","reponses":[{"reponse":"sdsd","descriptionReponse":"sdds","descriptionMauvaiseReponse":"sdsd"}]}';
const QUESTIONCM = '{"typeQuestion":"question-choix-multiples","description":"Description CM","tags":"a,b,c","nom":"Question CM","idEspaceCours":"3","reponses":[{"reponse":true,"choix":"Bonne reponse","descriptionReponse":"Bravo","descriptionMauvaiseReponse":"Fail"},{"reponse":false,"choix":"Mauvaise reponse","descriptionReponse":"Bravo","descriptionMauvaiseReponse":"Fail"}]}';
const QUESTIONCORRESPONDANCE = '{"typeQuestion":"question-mise-correspondance","description":"Question courte","tags":"a,b,c","nom":"Correspondance","idEspaceCours":"3","reponses":[{"reponse":"Description ","descriptionReponse":"Bravo","descriptionMauvaiseReponse":"Fail","correspondance":"chapeau"}],"correspondances":["chapeau"]}';
const QUESTIONCOURTE = '{"typeQuestion":"question-reponse-courte","description":"Le txt","tags":"a,c,b","nom":"Question Courte","idEspaceCours":"3","reponses":[{"reponse":"La reponse","descriptionReponse":"Bravo","descriptionMauvaiseReponse":"FAil"}]}';
const QUESTIONNUMERIQUE = '{"typeQuestion":"question-numerique","description":"5 + 5","tags":"a,c,v","nom":"Question Num","idEspaceCours":"3","reponses":[{"reponse":"10","descriptionReponse":"Bravo","descriptionMauvaiseReponse":"Fail"}]}';
const QUESTIONREDACTION = '{"typeQuestion":"question-essay","description":"La question essaie","tags":"a,b,c,","nom":"Question Redaction","idEspaceCours":"3","reponses":[]}';
const QUESTIONNAIRE1 = '{"idEspaceCours":"1","estModification":"false","idQuestionnaire":"","nom":"Questionnaire1","description":"description1","status":"on"}'

beforeAll((done)=>{
    request.post("/api/v1/login")
            .send({email: "teacher+1@gmail.com", password: ""})
            .end(function(err) {
                if(err) return done(err);
                authenticatedSession=request
                return done();
            })
})

beforeEach(() => {
    //Permet de ne pas afficher les console.error du middleware.error.ts
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(function () {
    universite.reset();
});

describe('Ajouter une question', ()=> {

    beforeEach(async()=> {
        await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({data: COURSEVALUE1})
    })

    it("Ajouter une question a un groupe cour", async()=>{
        
        const reponse = await authenticatedSession.post("/api/v1/enseignant/question/ajouter/1")
                                .send(JSON.parse(QUESTION1))
        expect(reponse.status).toBe(201)
        expect(reponse.body.message).toContain("Success")
        let questions = universite.recupererUnEspaceCours(1).recupererToutesQuestions();
        expect(questions[0].getId()).toBe(1);

    })

    it("Ajouter un question a choix multiple", async()=> {

        const reponse = await authenticatedSession.post("/api/v1/enseignant/question/ajouter/1")
                                .send(JSON.parse(QUESTIONCM))
        expect(reponse.status).toBe(201)
        expect(reponse.body.message).toContain("Success")

    })

    it("Ajouter une question par correspondace", async()=> {

        const reponse = await authenticatedSession.post("/api/v1/enseignant/question/ajouter/1")
                                .send(JSON.parse(QUESTIONCORRESPONDANCE))
        expect(reponse.status).toBe(201)
        expect(reponse.body.message).toContain("Success")

    })

    it("Ajouter une question a reponse courte", async()=> {

        const reponse = await authenticatedSession.post("/api/v1/enseignant/question/ajouter/1")
                                .send(JSON.parse(QUESTIONCOURTE))
        expect(reponse.status).toBe(201)
        expect(reponse.body.message).toContain("Success")

    })

    it("Ajouter une question numerique", async() => {

        const reponse = await authenticatedSession.post("/api/v1/enseignant/question/ajouter/1")
                                .send(JSON.parse(QUESTIONNUMERIQUE))
        expect(reponse.status).toBe(201)
        expect(reponse.body.message).toContain("Success")

    })

    it("Ajouter une question redaction", async()=> {

        const reponse = await authenticatedSession.post("/api/v1/enseignant/question/ajouter/1")
                                .send(JSON.parse(QUESTIONREDACTION))
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
        expect(get.body.question._idEspaceCours).toBe(1)
        expect(get.body.question._id).toBe(1)
        expect(get.body.question._nbOccurence).toBe(0)
        expect(get.body.question._nom).toContain("Question1")
        expect(get.body.question._tags[0]).toContain("q1")
        expect(get.body.question._tags[1]).toContain("q2")
        expect(get.body.question._answerChoix[0].bonneReponseText).toContain("sdds")
        expect(get.body.question._answerChoix[0].mauvaiseReponseText).toContain("sdsd")
        expect(get.body.question._answerChoix[0].reponse).toContain("sdsd")
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
        expect(question._idEspaceCours).toBe(2)
        expect(question._id).toBe(2)

    })
})

describe('Modifier question', ()=> {
    it("Modifier une question d'un espace cours", async()=> {

        await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({data: COURSEVALUE1})
        await authenticatedSession.post("/api/v1/enseignant/question/ajouter/1")
                                .send(JSON.parse(QUESTION1))
        
        const reponse = await authenticatedSession.put("/api/v1/enseignant/question/modifier/1/1").send(JSON.parse(QUESTION2))

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

describe("Test occurence d'une question", ()=> {

    it("devrais retourner la bonne occurence lors d'un ajout d'une question a un questionnaire ", async() => {

        await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({data: COURSEVALUE1})
        await authenticatedSession.post("/api/v1/enseignant/question/ajouter/1")
                                .send(JSON.parse(QUESTION1))
        await authenticatedSession.post("/api/v1/enseignant/questionnaire/ajouter/1").send({QUESTIONNAIRE1}) 
        let reponse = await authenticatedSession.put("/api/v1/enseignant/questionnaire/question/1/1").send({data: '1'})
        let question = universite.recupererUnEspaceCours(1).recupererUneQuestion(1)

        expect(reponse.status).toBe(200)
        expect(reponse.body.message).toContain("Success")
        expect(question.getNbOccurence()).toBe(1)

    })

    it("devrais retourner la bonne occurence lors d'une supression d'une question a un questionnaire ",async()=> {
        
        await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({data: COURSEVALUE1})
        await authenticatedSession.post("/api/v1/enseignant/question/ajouter/1")
                                .send(JSON.parse(QUESTION1))
        await authenticatedSession.post("/api/v1/enseignant/questionnaire/ajouter/1").send({QUESTIONNAIRE1}) 
        let reponse = await authenticatedSession.put("/api/v1/enseignant/questionnaire/question/1/1").send({data: ''})

        let question = universite.recupererUnEspaceCours(1).recupererUneQuestion(1)

        expect(reponse.status).toBe(200)
        expect(reponse.body.message).toContain("Success")
        expect(question.getNbOccurence()).toBe(0)
    })

})