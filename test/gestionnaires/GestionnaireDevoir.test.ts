import 'jest-extended';
import app, { universite } from "../../src/App";
import { Etat } from '../../src/core/model/enum/Etat';

var session = require("supertest-session")
var request = session(app)
var authenticatedSession;
const COURSEVALUE1 = '{"_id":1,"_sigle":"LOG210","_nb_max_student":5,"_groupe":"01","_titre":"Analyse et conception de logiciels","_date_debut":"2019-09-01","_date_fin":"2019-09-02"}'
const COURSEVALUE2 = '{"_id":2,"_sigle":"LOG210","_nb_max_student":5,"_groupe":"02","_titre":"Analyse et conception de logiciels","_date_debut":"2019-09-02","_date_fin":"2019-09-03"}'
const DEVOIR1 = '{"nom":"devoir1","idEspaceCours":"1","description":"ceci est une description","noteMaximale":"90","dateDebut":"10-10-2019","dateFin":"11-11-2041","visible":"true"}';
const DEVOIR2 = '{"nom":"devoir2","idEspaceCours":"2","description":"ceci est une description","noteMaximale":"90","dateDebut":"10-10-2019","dateFin":"11-11-2019","visible":"true"}';

const pathFichier = "./src/data/cache/test-upload.pdf";
const pathFichierZip = "./src/data/cache/correction-devoir-1-1627351993883.zip"
const pathFichierInvalid = "./src/data/cache/correction-devoir-1-invalid.zip"
const pathFichierInvalid2 = "./src/data/cache/correction-devoir-1-invalid2.zip"

beforeAll((done) => {
    request.post("/api/v1/login")
        .send({ email: "teacher+1@gmail.com", password: "" })
        .end(function (err) {
            if (err) return done(err);
            authenticatedSession = request
            return done();
        })
})

beforeEach(() => {
    //Permet de ne pas afficher les console.error du middleware.error.ts
    jest.spyOn(console, 'error').mockImplementation(() => { });
});

afterEach(function () {
    universite.reset();
});

describe('Ajouter un devoir', () => {

    it("Ajouter un devoir a un groupe cour", async () => {
        await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({ data: COURSEVALUE1 })

        const reponse = await authenticatedSession.post("/api/v1/enseignant/devoir/ajouter/1")
            .send(JSON.parse(DEVOIR1))
        expect(reponse.status).toBe(201)
        expect(reponse.body.message).toContain("Success")

    })
})

describe('Recuperer tous devoirs espace cours', () => {
    it("Recuperer tous devoirs d'un espace cours du SGA", async () => {

        await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({ data: COURSEVALUE1 })
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

describe('Modifier devoir', () => {
    it("Modifier un devoir d'un espace cours", async () => {

        await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({ data: COURSEVALUE1 })
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

describe('Supprimer devoir', () => {
    it("Supprimer un devoir", async () => {

        await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({ data: COURSEVALUE1 })
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


describe('Details devoirs', () => {
    it("Obtenir les details d'un devoir", async () => {

        await authenticatedSession.post("/api/v1/enseignant/cours/ajouter").send({ data: COURSEVALUE1 })

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
        expect(get.body.devoir._dateDebut).toContain("10-10-2019")
        expect(get.body.devoir._dateFin).toContain("11-11-2041")
        expect(get.body.devoir._visible).toBeTrue
    })
})



describe('Remettre devoir', () => {

    beforeEach(async (done) => {
        await universite.ajouterEspaceCours(JSON.parse(COURSEVALUE1), "e44cd054a9b7f4edee4f1f0ede5ee704", 1)
        let cours = universite.recupererUnEspaceCours(1);
        cours.ajouterDevoir(DEVOIR1);
        await universite.ajouterEspaceCours(JSON.parse(COURSEVALUE2), "e44cd054a9b7f4edee4f1f0ede5ee704", 1)
        let cours2 = universite.recupererUnEspaceCours(2);
        cours2.ajouterDevoir(DEVOIR2);
        done();
    });


    var authenticatedSessionEtudiant;

    beforeAll((done) => {
        request.post("/api/v1/login")
            .send({ email: "student+1@gmail.com", password: "" })
            .end(function (err) {
                if (err) return done(err);
                authenticatedSessionEtudiant = request
                return done();
            })
    })

    it("??tudiant - Remettre devoir - Simple", async (done) => {
        authenticatedSessionEtudiant.post("/api/v1/etudiant/devoir/remettre")
            //.send({idEspaceCours: 1, idDevoir: 1})
            .field({ idEspaceCours: 1, idDevoir: 1 })
            .attach('devoir', pathFichier)
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.message).toBe("Success")
                expect(res.body.path).toContain("/uploads/devoirs")

                let cours = universite.recupererUnEspaceCours(1);
                let devoir = cours.recupererUnDevoir(1);
                expect(devoir.getRemiseById(1).etat).toEqual(Etat.Remis)
                done();
            })
    })

    it("??tudiant - Remettre devoir - Sans fichier", async (done) => {
        authenticatedSessionEtudiant.post("/api/v1/etudiant/devoir/remettre")
            .field({ idEspaceCours: 1, idDevoir: 1 })
            .end((err, res) => {
                expect(res.status).toBe(400)
                expect(res.body.error.message).toBe("Vous devez fournir un fichier pdf")
                let cours = universite.recupererUnEspaceCours(1);
                let devoir = cours.recupererUnDevoir(1);
                expect(devoir.getRemiseById(1).etat).toEqual(Etat.NonRemis)
                done();
            })
    })

    it("??tudiant - Remettre devoir - Pas l'authorization", async (done) => {
        request.post("/api/v1/login")
            .send({ email: "student+2@gmail.com", password: "" })
            .end(function (err) {
                if (err) return done(err);

                request.post("/api/v1/etudiant/devoir/remettre")
                    .field({ idEspaceCours: 1, idDevoir: 1 })
                    .attach('devoir', pathFichier)
                    .end((err, res) => {
                        expect(res.status).toBe(401)
                        expect(res.body.error.message).toBe("L'??tudiant n'a pas acc??s au devoir");
                        done();
                    })
            })
    })

    it("??tudiant - Remettre devoir - Date invalide/invisible", async (done) => {
        authenticatedSessionEtudiant.post("/api/v1/etudiant/devoir/remettre")
            .field({ idEspaceCours: 2, idDevoir: 2 })
            .attach('devoir', pathFichier)
            .end((err, res) => {
                expect(res.status).toBe(500)
                expect(res.body.error.message).toBe("Le devoir ne permet pas de remises");
                done();
            })
    })
})

describe('Recuperer devoir ??tudiant', () => {

    beforeEach(async (done) => {
        await universite.ajouterEspaceCours(JSON.parse(COURSEVALUE1), "e44cd054a9b7f4edee4f1f0ede5ee704", 1)
        let cours = universite.recupererUnEspaceCours(1);
        cours.ajouterDevoir(DEVOIR1);
        done();
    });

    var authenticatedSessionEtudiant;

    beforeAll((done) => {
        request.post("/api/v1/login")
            .send({ email: "student+1@gmail.com", password: "" })
            .end(function (err) {
                if (err) return done(err);
                authenticatedSessionEtudiant = request
                return done();
            })
    })

    it("??tudiant - R??cuperer tous devoirs ", async (done) => {
        authenticatedSessionEtudiant.get("/api/v1/etudiant/devoir/1")
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.type).toBe("application/json");
                done();
            })
    })

    it("??tudiant - R??cuperer un devoir ", async (done) => {
        authenticatedSessionEtudiant.get("/api/v1/etudiant/devoir/detail/1/1")
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.type).toBe("application/json");
                done();
            })
    })
})


describe('Corriger devoir', () => {
    beforeAll((done) => {
        request.post("/api/v1/login")
            .send({ email: "teacher+1@gmail.com", password: "" })
            .end(function (err) {
                if (err) return done(err);
                authenticatedSession = request
                return done();
            })
    })
    beforeEach(async (done) => {
        await universite.ajouterEspaceCours(JSON.parse(COURSEVALUE1), "e44cd054a9b7f4edee4f1f0ede5ee704", 1)
        let cours = universite.recupererUnEspaceCours(1);
        cours.ajouterDevoir(DEVOIR1);
        let devoir = cours.recupererUnDevoir(1);
        devoir.remettreDevoir(1, "blabla");
        done();
    });

    it("Corriger devoir - Simple - Sans fichier", async () => {

        const reponse = await authenticatedSession.post("/api/v1/enseignant/devoir/corriger")
            .send({
                idEspaceCours: 1,
                idDevoir: 1,
                idRemise: 1,
                noteDevoir: 50
            })

        expect(reponse.status).toBe(200)
        let cours = universite.recupererUnEspaceCours(1);
        let devoir = cours.recupererUnDevoir(1);
        expect(devoir.getRemiseById(1).etat).toEqual(Etat.RemisCorrige)
        expect(devoir.getRemiseById(1).note).toEqual(50)
    })

    it("Corriger devoir - Simple - Avec fichier", async () => {

        const reponse = await authenticatedSession.post("/api/v1/enseignant/devoir/corriger")
            .field({
                idEspaceCours: 1,
                idDevoir: 1,
                idRemise: 1,
                noteDevoir: 60
            })
            .attach('devoir', pathFichier)

        expect(reponse.status).toBe(200)
        let cours = universite.recupererUnEspaceCours(1);
        let devoir = cours.recupererUnDevoir(1);
        expect(devoir.getRemiseById(1).etat).toEqual(Etat.RemisCorrige)
        expect(devoir.getRemiseById(1).note).toEqual(60)
    })
})


describe('Modifier/Supprimer devoir - Avec une remise', () => {
    beforeEach(async (done) => {
        await universite.ajouterEspaceCours(JSON.parse(COURSEVALUE1), "e44cd054a9b7f4edee4f1f0ede5ee704", 1)
        let cours = universite.recupererUnEspaceCours(1);
        cours.ajouterDevoir(DEVOIR1);
        let devoir = cours.recupererUnDevoir(1);
        devoir.remettreDevoir(1, "blabla");
        done();
    });

    it("Modifier un devoir d'un espace cours avec remise", async () => {
        const reponse = await authenticatedSession.put("/api/v1/enseignant/devoir/modifier/1/1").send(JSON.parse(DEVOIR2))
        expect(reponse.status).toBe(500)
        expect(reponse.body.error.message).toBe("Impossible de modifier un devoir, ayant d??j?? une remise d'un ??tudiant");

    })

    it("Supprimer un devoir avec remise", async () => {
        const reponse = await authenticatedSession.delete("/api/v1/enseignant/devoir/supprimer/1/1")
        expect(reponse.status).toBe(500)
        expect(reponse.body.error.message).toBe("Impossible de supprimer un devoir, ayant d??j?? une remise d'un ??tudiant");

    })
})


describe('Telecharger Zip remise ', () => {

    beforeEach(async (done) => {

        await universite.ajouterEspaceCours(JSON.parse(COURSEVALUE1), "e44cd054a9b7f4edee4f1f0ede5ee704", 1)
        let cours = universite.recupererUnEspaceCours(1);
        cours.ajouterDevoir(DEVOIR1);
        let devoir = cours.recupererUnDevoir(1);


        await request.post("/api/v1/login")
            .send({ email: "student+1@gmail.com", password: "" })
        await request.post("/api/v1/etudiant/devoir/remettre")
            .field({ idEspaceCours: 1, idDevoir: 1 })
            .attach('devoir', pathFichier)


        await request.post("/api/v1/login")
            .send({ email: "student+2@gmail.com", password: "" })
        await request.post("/api/v1/etudiant/devoir/remettre")
            .field({ idEspaceCours: 1, idDevoir: 1 })
            .attach('devoir', pathFichier)


        done();
    })


    it("Telecharger zip devoir", async (done) => {
        request.post("/api/v1/login")
            .send({ email: "teacher+1@gmail.com", password: "" })
            .end(function (err) {
                if (err) return done(err);
                authenticatedSession = request
                authenticatedSession.get("/api/v1/enseignant/devoir/zip/1/1").end(function (err, res) {
                    expect(res.status).toBe(200);
                    expect(res.type).toBe("application/zip");
                    return done();
                });
            })
    })

});


describe('Corriger devoirs batch', () => {

    beforeEach(async (done) => {

        await universite.ajouterEspaceCours(JSON.parse(COURSEVALUE1), "e44cd054a9b7f4edee4f1f0ede5ee704", 1)
        let cours = universite.recupererUnEspaceCours(1);
        cours.ajouterDevoir(DEVOIR1);

        await request.post("/api/v1/login")
            .send({ email: "student+1@gmail.com", password: "" })
        await request.post("/api/v1/etudiant/devoir/remettre")
            .field({ idEspaceCours: 1, idDevoir: 1 })
            .attach('devoir', pathFichier)

        done();
    })


    it("Corriger zip devoir - simple", async (done) => {
        request.post("/api/v1/login")
            .send({ email: "teacher+1@gmail.com", password: "" })
            .end(function (err) {
                if (err) return done(err);
                authenticatedSession = request


                authenticatedSession.post("/api/v1/enseignant/devoir/corriger/batch")
                    .field({ idEspaceCours: 1, idDevoir: 1 })
                    .attach('devoirRetroactionZip', pathFichierZip)
                    .end((err, res) => {
                        expect(res.status).toBe(200)
                        expect(res.body.message).toBe("Success")


                        let cours = universite.recupererUnEspaceCours(1);
                        let devoir = cours.recupererUnDevoir(1);
                        expect(devoir.getRemiseById(1).etat).toEqual(Etat.RemisCorrige)
                        expect(devoir.getRemiseById(1).note).toEqual(50)
                        return done();
                    })
            })
    })

    it("Corriger zip devoir - error invalide pas de CSV", async (done) => {
        request.post("/api/v1/login")
            .send({ email: "teacher+1@gmail.com", password: "" })
            .end(function (err) {
                if (err) return done(err);
                authenticatedSession = request

                authenticatedSession.post("/api/v1/enseignant/devoir/corriger/batch")
                    .field({ idEspaceCours: 1, idDevoir: 1 })
                    .attach('devoirRetroactionZip', pathFichierInvalid2)
                    .end((err, res) => {
                        expect(res.status).toBe(400)
                        expect(res.body.error.message).toBe("Erreur pour la correction du devoir en Mode Multiple - le ZIP doit contenir un fichier .CSV")
                        return done();
                    })
            })
    });

    it("Corriger zip devoir - error invalide - NOTE INVALIDE", async (done) => {
        request.post("/api/v1/login")
            .send({ email: "teacher+1@gmail.com", password: "" })
            .end(function (err) {
                if (err) return done(err);
                authenticatedSession = request


                authenticatedSession.post("/api/v1/enseignant/devoir/corriger/batch")
                    .field({ idEspaceCours: 1, idDevoir: 1 })
                    .attach('devoirRetroactionZip', pathFichierInvalid)
                    .end((err, res) => {
                        expect(res.status).toBe(400)
                        expect(res.body.error.message).toContain("Erreur pour la correction du devoir en Mode Multiple - le fichier CSV contient")
                        return done();
                    })
            })
    });

    it("Corriger zip devoir - error pas de zip", async (done) => {
        request.post("/api/v1/login")
            .send({ email: "teacher+1@gmail.com", password: "" })
            .end(function (err) {
                if (err) return done(err);
                authenticatedSession = request

                authenticatedSession.post("/api/v1/enseignant/devoir/corriger/batch")
                    .field({ idEspaceCours: 1, idDevoir: 1 })
                    .end((err, res) => {
                        expect(res.status).toBe(400)
                        expect(res.body.error.message).toContain("Vous devez fournir un fichier zip")
                        return done();
                    })
            })
    });

});

