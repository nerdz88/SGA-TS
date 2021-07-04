import supertestSession from "supertest-session"
import 'jest-extended';
import { SGBService } from "../../src/core/service/SGBService";
import { SgbError} from "../../src/core/errors/SgbError";
import app, {universite} from "../../src/App";
import { AuthorizationHelper  } from "../../src/core/helper/AuthorizationHelper";
import { doesNotReject } from "assert";

var session = require("supertest-session")
var request =  session(app)
var authenticatedSession;
const COURSEVALUE1 = '{"_id":1,"_sigle":"LOG210","_nb_max_student":5,"_groupe":"01","_titre":"Analyse et conception de logiciels","_date_debut":"2019-09-01","_date_fin":"2019-09-02"}';
const QUESTIONNAIRE1 = '{"idEspaceCours":"1","estModification":"false","idQuestionnaire":"","nom":"Questionnaire1","description":"description1","status":"on"}'
const QUESTIONNAIRE2 = '{"idEspaceCours":"1","estModification":"false","idQuestionnaire":"","nom":"Questionnaire2","description":"description2","status":"off"}'


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

describe('Test Gestionnaire Questionnaire', ()=> {

    it("Ajouter un questionnaire dans le SGA et recuprer les details", async()=> {

        await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({data: COURSEVALUE1})
        
        let reponse = await authenticatedSession.post("/api/v1/enseignant/questionnaire/ajouter/1").send({QUESTIONNAIRE1})
        expect(reponse.status).toBe(201)
        expect(reponse.body.message).toContain("Success")
        expect(reponse.body.idQuestionnaire).toBe(1)

        let questionnaires = await authenticatedSession.get("/api/v1/enseignant/questionnaire/1")

        expect(questionnaires.status).toBe(200)
        expect(questionnaires.body.message).toContain("Success")
        expect(questionnaires.body.data.idEspaceCours).toBe("1")
        
        let unQuestionnaire = questionnaires.body.data.questionnaires[0]

        expect(unQuestionnaire._id).toBe(1)
        
    })

})


describe('Test Gestionnaire Questionnaire', ()=> {

    it("Recuperer tous les questionnaires", async()=>{

        await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({data: COURSEVALUE1})
        await authenticatedSession.post("/api/v1/enseignant/questionnaire/ajouter/1").send({QUESTIONNAIRE1})
        await authenticatedSession.post("/api/v1/enseignant/questionnaire/ajouter/1").send({QUESTIONNAIRE2})

        let reponse = await authenticatedSession.get("/api/v1/enseignant/questionnaire/")

        expect(reponse.status).toBe(200)
        expect(reponse.body.message).toContain("Success")
        expect(reponse.body.data.idEspaceCours).toBeEmpty
        
        expect(reponse.body.data.questionnaires[0]._id).toBe(1)
        expect(reponse.body.data.questionnaires[1]._id).toBe(2)

    })

})

describe("Test suppression d'un questionnaire", ()=>{
    it("devrais retirer un questionnaire",async()=> {

        await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({data: COURSEVALUE1})
        await authenticatedSession.post("/api/v1/enseignant/questionnaire/ajouter/1").send({QUESTIONNAIRE1})
        
        let reponse = await authenticatedSession.delete("/api/v1/enseignant/questionnaire/supprimer/1/1")

        expect(reponse.status).toBe(200)
        expect(universite.recupererUnEspaceCours(1).recupererToutQuestionnaires()).toBeArrayOfSize(0)

    })
})

describe("Test details d'un questionnaire", ()=> {


    it("recuperer details d'un questionnaire", async()=>{

        

    })

})

