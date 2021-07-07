import 'jest-extended';
import 'reflect-metadata';
import { Etudiant } from "../../src/core/model/Etudiant"
import { Remise } from "../../src/core/model/Remise"
import { Etat } from "../../src/core/model/Remise"
import { OrdreTriRemise } from "../../src/core/model/Remise"

const etudiant1 = new Etudiant(1,"Larouche","Mathieu","lm@gmail.com","LM1");
const etudiant2 = new Etudiant(2,"Zoubir","Imad","lm@gmail.com","ZI1");
const etudiant3 = new Etudiant(3,"Tremblay","Jean-Francois","lm@gmail.com","TJ1");
const etudiant4 = new Etudiant(4,"Price","Carey","lm@gmail.com","PC1");
const etudiant5 = new Etudiant(5,"Gallagher","Max","mg@gmail.com","GM1")

const remise1 = new Remise(etudiant1)
const remise2 = new Remise(etudiant2)
const remise3 = new Remise(etudiant3)
const remise4 = new Remise(etudiant4)

const remises = [remise1,remise2,remise3,remise4]


describe("Test Model Remise", ()=> {

    it("Devrais retourner la liste d'etudiant dans l'ordre spécifié", ()=> {

        Remise.orderBy(remises, OrdreTriRemise.NomEtudiantAlphaCroissant)
        expect(remises[0].etudiant.getNom()).toContain("Larouche")
        Remise.orderBy(remises, OrdreTriRemise.NomEtudiantAlphaDecroissant)
        expect(remises[0].etudiant.getNom()).toContain("Zoubir")

    })

    it("Devrais retourner la liste des etuidiants trier par note", ()=> {

        remise1.note = 60
        remise2.note = 80
        remise3.note = 100
        remise4.note = 35

        Remise.orderBy(remises, OrdreTriRemise.NoteCroissant)
        expect(remises[0].etudiant.getNom()).toContain("Price")

        Remise.orderBy(remises, OrdreTriRemise.NoteDecroissant)
        expect(remises[0].etudiant.getNom()).toContain("Price")

    })

    it("Test getter setter", async()=> {

        remise1.id = 5;
        remise1.etudiant = etudiant5
        remise1.note = 100
        remise1.etat = Etat.Remis
        

        expect(remise1.id).toBe(5)
        expect(remise1.etudiant).toBeObject
        expect(remise1.note).toBe(100)
        expect(remise1.etat).toEqual(Etat.Remis)

    })

})