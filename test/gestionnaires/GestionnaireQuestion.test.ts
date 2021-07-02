import 'jest-extended';
import app, { universite } from "../../src/App";

var session = require("supertest-session")
var request =  session(app)
var authenticatedSession;
const COURSEVALUE1 = '{"_id":1,"_sigle":"LOG210","_nb_max_student":5,"_groupe":"01","_titre":"Analyse et conception de logiciels","_date_debut":"2019-09-01","_date_fin":"2019-09-02"}';

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

describe('Test SgaRouteur', ()=> {

    it("Devrais ajouter avec succes le nouveau cours", async()=> {
        const reponse = await authenticatedSession.post("/api/v1/enseignant/cours/ajouter")
                                .send({data: COURSEVALUE1 })
        expect(reponse.status).toBe(201)
    })

    it("Devrais retourner la liste des cours de l'enseignant", async()=> {

        const add = await authenticatedSession.post("/api/v1/enseignant/cours/ajouter")
                                .send({data: COURSEVALUE1 })

        const reponse = await authenticatedSession.get("/api/v1/enseignant/cours")

        expect(reponse.status).toBe(200)
        expect(reponse.body.message).toContain("Success")
        expect(reponse.body.espaceCours[0]._cours._sigle).toContain("LOG210")

    })

})