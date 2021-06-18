import { GroupeCours } from "../../src/core/model/GroupeCours";
import 'jest-extended'
import { Etudiant } from "../../src/core/model/Etudiant";

let groupeCours

beforeAll(async ()=> {

    groupeCours = new GroupeCours(1,"01","2021-05-05","2021-08-05")
    let etudiant1 = new Etudiant(1, "firstname1", "lastname1", "fnln1@gmail.com", "FNLN09089901")
    let etudiant2 = new Etudiant(1, "firstname2", "lastname2", "fnln2@gmail.com", "FNLN09089902")
    groupeCours.ajouterEtudiants(etudiant1)
    groupeCours.ajouterEtudiants(etudiant2)

})



