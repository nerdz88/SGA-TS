import 'jest-extended';
import { GestionnaireUtilisateur } from "../../src/core/controllers/GestionnaireUtilisateur";

describe("Test gestionnaire Utilisateur", () => {

    it("Devrais lancer une erreur lors de l'echec de l'appel", async () => {

        let gu = new GestionnaireUtilisateur()
        expect(gu.login("randomemail@gmail.com", "wrongPassword")).toThrowError

    })

})