import 'jest-extended'
import { Cours } from '../../src/core/model/Cours'

var cours

beforeAll(()=>{
    cours = new Cours("LOG210","Analyse et Conception de Logiciels",5)
})

describe('Test de la classe Cours', () => {

    test("Creation d'un objet cours et validation des composantes", () => {
        
        expect(cours.getSigle()).toContain("LOG210")
        expect(cours.getTitre()).toContain("Analyse et Conception de Logiciels")
        expect(cours.getNbMaxEtudiant()).toBe(5)

    })

})