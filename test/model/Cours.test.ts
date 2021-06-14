import { toBindingIdentifierName } from "@babel/types";
import { Cours } from "../../src/core/model/Cours";
import { GroupeCours } from "../../src/core/model/GroupeCours";
import 'jest-extended'
import { AlreadyExistsError } from "../../src/core/errors/AlreadyExistsError";

var cours
var groupeCours

beforeAll(async () => {
    cours = new Cours("LOG210", "Analyse et Conception de Logiciels", 5)
    groupeCours = new GroupeCours(1,"01","2021-05-05","2021-08-05")
    cours.ajoutGroupeCours(groupeCours)
});

describe('Test de la classe Cours', () => {

    test("Creation d'un objet cours et validation des composantes", () => {
        
        expect(cours.getSigle()).toContain("LOG210")
        expect(cours.getTitre()).toContain("Analyse et Conception de Logiciels")
        expect(cours.getNbMaxEtudiant()).toBe(5)
        expect(cours.getGroupeCours()).toBeArrayOfSize(1)
        expect(cours.getGroupeCoursByID(1)).toBeObject

    })

    test("Methode taille groupe cours", () => {
        expect(cours.getTailleCours()).toBe(1);
    })

    test("Ajouter le meme groupe cours devrais lancer une erreur", () => {

        expect(()=> {
            cours.ajoutGroupeCours(groupeCours)
        }).toThrowError(AlreadyExistsError)

    })

    test("Destruction d'un groupeCours", () => {

        cours.deleteGroupeById(1)
        expect(cours.getGroupeCours()).toBeEmpty

    })
})