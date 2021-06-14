import { Etudiant } from "../../src/core/model/Etudiant"
import 'jest-extended'
import { exception } from "console"

describe('Test de la classe Cours', () => {

    test("Creation d'un objet Etudiant et validation des composantes", () => {
      
        let etudiant = new Etudiant(1, "nom", "prenom", "email@gmail.com", "ABCD12345678")

        expect(etudiant.getId()).toBe(1);
        expect(etudiant.getNom()).toContain("nom")
        expect(etudiant.getPrenom()).toContain("prenom")
        expect(etudiant.getEmail()).toContain("email@gmail.com")
        expect(etudiant.getCodePermanent()).toContain("ABCD12345678")

    })
})