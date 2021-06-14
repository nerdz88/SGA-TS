import * as supertest from "supertest";
import 'jest-extended';
import app from '../../src/App';
import { SGBService } from "../../src/core/service/SGBService";

let token = "e44cd054a9b7f4edee4f1f0ede5ee704"

describe('Testing SGB service endpoint calls', () => {

    it("repond par un appel avec succes et l'information des cours de l'enseignant ", async () => {

        const reponse = await SGBService.recupererJsonCours(token);

        console.log(reponse);
        expect(reponse.message).toBe("Success");
        expect(reponse.data[0]._id).toBe(1)
        expect(reponse.data[0]._sigle).toContain("LOG210")
        expect(reponse.data[0]._nb_max_student).toBe(5)
        expect(reponse.data[0]._groupe).toContain("01")
        expect(reponse.data[0]._titre).toContain("Analyse et conception de logiciels")
        expect(reponse.data[0]._date_debut).toContain("2019-09-01")
        expect(reponse.data[0]._date_fin).toContain("2019-09-02")

    });

    it("repond par une appel avec succes et l'information des etudiants d'un cours", async() => {

        const reponse = await SGBService.recupererEtudiant(null, 1, token);

        console.log(reponse)
        expect(reponse.message).toBe("Success")
        expect(reponse.data[0]._id).toBe(1)
        expect(reponse.data[0]._first_name).toContain("firstname1")
        expect(reponse.data[0]._last_name).toContain("last_name1")
        expect(reponse.data[0]._email).toContain("student+1@gmail.com")
        expect(reponse.data[0]._permanent_code).toContain("lastf1")

    })


});
