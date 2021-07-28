import 'jest-extended';
import { SgbError } from "../../src/core/errors/SgbError";
import { SGBService } from "../../src/core/service/SGBService";

describe('Test gestionnaire des cours', () => {

    it("Devrais repondre avec succes a l'appel d'une requete de Login", async () => {

        const reponse = await SGBService.login("teacher+1@gmail.com", "")

        expect(reponse.token).toContain("e44cd054a9b7f4edee4f1f0ede5ee704")
        expect(reponse.user.id).toBe(1)
        expect(reponse.user.first_name).toContain("firstname1")
        expect(reponse.user.last_name).toContain("last_name1")
        expect(reponse.user.email).toContain("teacher+1@gmail.com")

    })

    it("Devrais lancer une erreur lors d'une erreur de login", async () => {

        await expect(SGBService.login("wrongInfo@noInfo.com", "wrong")).rejects.toThrowError(SgbError)

    })

    it("Devrais repondre avec succes a l'appel de la recuperation d'un cours", async () => {

        const reponse = await SGBService.recupererGroupesCours('e44cd054a9b7f4edee4f1f0ede5ee704')

        expect(reponse[0]._id).toBe(1)
        expect(reponse[0]._sigle).toContain("LOG210")
        expect(reponse[0]._nb_max_student).toBe(5)
        expect(reponse[0]._groupe).toContain("01")
        expect(reponse[0]._titre).toContain("Analyse et conception de logiciels")
        expect(reponse[0]._date_debut).toContain("2019-09-01")
        expect(reponse[0]._date_fin).toContain("2019-09-02")

    })

    it("Devrais lancer une erreur lors d'une erreur de la recuperation des cours en Json", async () => {

        await expect(SGBService.recupererGroupesCours("wrongToken!!")).rejects.toThrowError(SgbError)

    })

    it("Devrais repondre avec succes a l'appel de la recuperation des etudiants d'un cours", async () => {

        const reponse = await SGBService.recupererEtudiant('e44cd054a9b7f4edee4f1f0ede5ee704', 1)

        expect(reponse[0]._id).toBe(1)
        expect(reponse[0]._first_name).toContain("firstname1")
        expect(reponse[0]._last_name).toContain("last_name1")
        expect(reponse[0]._email).toContain("student+1@gmail.com")
        expect(reponse[0]._permanent_code).toContain("lastf1")

    })

    it("Devrais lancer une erreur lors d'une erreur de la recuperation des Etudiants", async () => {

        await expect(SGBService.recupererEtudiant("", 99)).rejects.toThrowError(SgbError)

    })

})
