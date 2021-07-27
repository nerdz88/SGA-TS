import 'jest-extended';
import app, { universite } from "../../src/App";

var session = require("supertest-session")
var request = session(app)
var authenticatedSession;
const QUESTIONNAIRE1 = '{"idEspaceCours":"1","estModification":"false","idQuestionnaire":"","nom":"sdssd","description":"sdsd","status":"on"}'
const COURSEVALUE1 = {"_id":1,"_sigle":"LOG210","_nb_max_student":5,"_groupe":"01","_titre":"Analyse et conception de logiciels","_date_debut":"2019-09-01","_date_fin":"2019-09-02","_disponible":true};
const QUESTIONS=['{"typeQuestion":"question-vrai-faux","description":"sdsdsd","tags":"sdsd","nom":"sdsdsd","idEspaceCours":"1","reponses":[{"reponse":true,"descriptionReponse":"","descriptionMauvaiseReponse":""}]}',
                '{"typeQuestion":"question-choix-multiples","description":"sdsd","tags":"sdsd","nom":"dssd","idEspaceCours":"1","reponses":[{"reponse":true,"choix":"sdsd","descriptionReponse":"sdsd","descriptionMauvaiseReponse":"sdsd"}]}',
                '{"typeQuestion":"question-mise-correspondance","description":"dssd","tags":"sdds","nom":"vasd","idEspaceCours":"1","reponses":[{"reponse":"sdsd","descriptionReponse":"sdsd","descriptionMauvaiseReponse":"sdsd","correspondance":"sdsdsd"}],"correspondances":["sdsdsd"]}',
                '{"typeQuestion":"question-reponse-courte","description":"sdsd","tags":"","nom":"vasdd","idEspaceCours":"1","reponses":[{"reponse":"wwe","descriptionReponse":"wew","descriptionMauvaiseReponse":"wewe"}]}',
                '{"typeQuestion":"question-numerique","description":"wewqe","tags":"weqqe","nom":"sddwewe","idEspaceCours":"1","reponses":[{"reponse":"20","descriptionReponse":"ffwf","descriptionMauvaiseReponse":"wewe"}]}',
                '{"typeQuestion":"question-essay","description":"weqweweq","tags":"weqwewqe","nom":"dsweqeqe","idEspaceCours":"1","reponses":[]}']
const REPONSESQUESTIONNAIRES=[{"idEspaceCours":"1","idQuestionnaire":"1","indexQuestion":"0","nbQuestions":"6","idQuestion":"1","reponse":"on"},
                            {"idEspaceCours":"1","idQuestionnaire":"1","indexQuestion":"1","nbQuestions":"6","idQuestion":"2","weqe":"on"},
                            {"idEspaceCours":"1","idQuestionnaire":"1","indexQuestion":"2","nbQuestions":"6","idQuestion":"3","weqwe":"sffsw"},
                            {"idEspaceCours":"1","idQuestionnaire":"1","indexQuestion":"3","nbQuestions":"6","idQuestion":"4","reponse":"wddwedde"},
                            {"idEspaceCours":"1","idQuestionnaire":"1","indexQuestion":"4","nbQuestions":"6","idQuestion":"5","reponse":"21"},
                            {"idEspaceCours":"1","idQuestionnaire":"1","indexQuestion":"5","nbQuestions":"6","idQuestion":"6","reponse":"dsfd"}]
const TOKENENSEIGNANT="e44cd054a9b7f4edee4f1f0ede5ee704";
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


describe('Test Action d"un étudiant ', () => {

    it("Recuperer la page questionnaire",async () => {
        await universite.ajouterEspaceCours(COURSEVALUE1,TOKENENSEIGNANT,1)
        expect(universite.recupererTousEspaceCours(1).length).toBe(1)
        let espaceCours=universite.recupererUnEspaceCours(1)
        espaceCours.ajouterQuestionnaire(QUESTIONNAIRE1)
        let reponse = await authenticatedSession.get("/etudiant/questionnaire/1");
        expect(reponse.status).toBe(200);
        expect(reponse.text).toContain("Système de Gestion des Apprentissages")
    })
    it("Afficher la page générale d'un questionnaire",async () => {
        await preCondition();
        let reponse = await authenticatedSession.get("/etudiant/questionnaire/afficher/1/1");
        expect(reponse.text).toContain("Système de Gestion des Apprentissages")
        expect(reponse.status).toBe(200);
    })

    it("Afficher la page avec index d'une question d'un questionnaire",async () => {
        await preCondition();
        let reponse = await authenticatedSession.get("/etudiant/questionnaire/afficher/1/1/1");
        expect(reponse.text).toContain("Système de Gestion des Apprentissages")
        expect(reponse.status).toBe(200);
    })



})


describe('Test ajouter un Questionnaire dans le SGA', () => {

    it("Devrais ajouter une tentative du questionnaire d'un etudiant",async () => {
        await preCondition();
        for(var i=0;i<REPONSESQUESTIONNAIRES.length;i++){
            let reponse = await authenticatedSession.post("/api/v1/etudiant/questionnaire/question/save/1/1/"+(i+1)).send(REPONSESQUESTIONNAIRES[i]);
            expect(reponse.status).toBe(200)
            expect(reponse.body.message).toContain("Success")
        }
    })
    it("Devrais terminer une tentative du questionnaire d'un etudiant",async () => {
        await preCondition();
        for(var i=0;i<REPONSESQUESTIONNAIRES.length;i++){
            let reponse = await authenticatedSession.post("/api/v1/etudiant/questionnaire/question/save/1/1/"+(i+1)).send(REPONSESQUESTIONNAIRES[i]);
            expect(reponse.status).toBe(200)
            expect(reponse.body.message).toContain("Success")
        }
        universite.recupererUnEspaceCours(1).recupererUnQuestionnaire(1).getTentative()[0].commencerTentative();
        let reponseTerminer = await authenticatedSession.get("/api/v1/etudiant/questionnaire/terminer/1/1");
        expect(reponseTerminer.status).toBe(200)
        expect(reponseTerminer.body.message).toContain("Success")
    })
})
async function preCondition() {
    await universite.ajouterEspaceCours(COURSEVALUE1, TOKENENSEIGNANT, 1);
    expect(universite.recupererTousEspaceCours(1).length).toBe(1);
    let espaceCours = universite.recupererUnEspaceCours(1);
    espaceCours.ajouterQuestionnaire(QUESTIONNAIRE1);
    QUESTIONS.forEach((question,i) => {
        espaceCours.ajouterQuestion(question);
        let q = espaceCours.recupererUneQuestion(i+1);
        espaceCours.recupererUnQuestionnaire(1).ajouterQuestion(q);
    });
    
}

