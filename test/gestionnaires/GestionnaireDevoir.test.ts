import 'jest-extended';
import app, { universite } from "../../src/App";

var session = require("supertest-session")
var request =  session(app)
var authenticatedSession;
const COURSEVALUE1 = '{"_id":1,"_sigle":"LOG210","_nb_max_student":5,"_groupe":"01","_titre":"Analyse et conception de logiciels","_date_debut":"2019-09-01","_date_fin":"2019-09-02"}'
const COURSEVALUE2 = '{"_id":2,"_sigle":"LOG210","_nb_max_student":5,"_groupe":"02","_titre":"Analyse et conception de logiciels","_date_debut":"2019-09-02","_date_fin":"2019-09-03"}'
const DEVOIR1 = '{"nom":"devoir1","idEspaceCours":"1","description":"ceci est une description","noteMaximale":"90","dateDebut":"10-10-2021","dateFin":"11-11-2021","visible":"true"}';
const DEVOIR2 = '{"nom":"devoir2","idEspaceCours":"2","description":"ceci est une description","noteMaximale":"90","dateDebut":"10-10-2021","dateFin":"11-11-2021","visible":"true"}';

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

describe('Ajouter un devoir', ()=> {

    it("Ajouter un devoir a un groupe cour", async()=>{
        await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({data: COURSEVALUE1})

        const reponse = await authenticatedSession.post("/api/v1/enseignant/devoir/ajouter/1")
            .send(JSON.parse(DEVOIR1))
        expect(reponse.status).toBe(201)
        expect(reponse.body.message).toContain("Success")

    })
})

describe('Recuperer tous devoirs espace cours', ()=> {
    it("Recuperer tous devoirs d'un espace cours du SGA",async()=>{

        await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({data: COURSEVALUE1})
        await authenticatedSession.post("/api/v1/enseignant/devoir/ajouter/1")
            .send(JSON.parse(DEVOIR1))
        await authenticatedSession.post("/api/v1/enseignant/devoir/ajouter/1")
            .send(JSON.parse(DEVOIR2))

        const reponse = await authenticatedSession.get("/api/v1/enseignant/devoir/1")
        expect(reponse.status).toBe(200)
        expect(reponse.body.message).toContain("Success")
        expect(reponse.body.data.devoirs).toBeArrayOfSize(2)

    })
})

describe('Modifier devoir', ()=> {
    it("Modifier un devoir d'un espace cours", async()=> {

        await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({data: COURSEVALUE1})
        await authenticatedSession.post("/api/v1/enseignant/devoir/ajouter/1")
            .send(JSON.parse(DEVOIR1))

        const reponse = await authenticatedSession.put("/api/v1/enseignant/devoir/modifier/1/1").send(JSON.parse(DEVOIR2))

        expect(reponse.status).toBe(200)
        expect(reponse.body.message).toContain("Success")

        const devoir = await authenticatedSession.get("/api/v1/enseignant/devoir/1")
        const devoirData = devoir.body.data.devoirs[0]
        expect(devoirData._id).toBe(1)
        expect(devoirData._nom).toContain("devoir2")

    })
})

describe('Supprimer devoir', ()=> {
    it("Supprimer un devoir", async()=> {

        await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({data: COURSEVALUE1})
        await authenticatedSession.post("/api/v1/enseignant/devoir/ajouter/1")
            .send(JSON.parse(DEVOIR1))
        const reponse = await authenticatedSession.delete("/api/v1/enseignant/devoir/supprimer/1/1")

        expect(reponse.status).toBe(200)
        expect(reponse.body.message).toContain("Success")

        const verification = await authenticatedSession.get("/api/v1/enseignant/devoir/1")

        expect(verification.status).toBe(200)
        expect(verification.body.data.devoirs).toBeEmpty

    })

})


describe('Details devoirs', ()=> {
    it("Obtenir les details d'un devoir", async()=> {

        await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({data: COURSEVALUE1})

        const reponse = await authenticatedSession.post("/api/v1/enseignant/devoir/ajouter/1")
            .send(JSON.parse(DEVOIR1))
        expect(reponse.status).toBe(201)
        expect(reponse.body.message).toContain("Success")

        const get = await authenticatedSession.get("/api/v1/enseignant/devoir/detail/1/1")
        expect(get.status).toBe(200)
        expect(get.body.message).toContain("Success")
        expect(get.body.devoir._idEspaceCours).toBe("1")
        expect(get.body.devoir._id).toBe(1)
        expect(get.body.devoir._nom).toContain("devoir1")
        expect(get.body.devoir._description).toContain("ceci est une description")
        expect(get.body.devoir._noteMaximale).toContain(90)
        expect(get.body.devoir._dateDebut).toContain("10-10-2021")
        expect(get.body.devoir._dateFin).toContain("11-11-2021")
        expect(get.body.devoir._visible).toBeTrue
    })
})