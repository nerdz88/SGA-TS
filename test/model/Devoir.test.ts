import 'jest-extended';
import 'reflect-metadata';
import { Devoir } from '../../src/core/model/Devoir'

var devoir

beforeEach(()=>{
    const DEVOIR1 = '{"nom":"devoir1","idEspaceCours":"1","description":"ceci est une description","noteMaximale":"90","dateDebut":"10-10-2021","dateFin":"11-11-2021","visible":"true"}';
    devoir = new Devoir(DEVOIR1,[])
})

describe('Test des GET de la classe modele Devoir', () => {
    test("Creation d'un objet Devoir et validation des composantes", () => {

        expect(devoir.nom).toContain("devoir1")
        expect(devoir.description).toContain("ceci est une description")
        expect(devoir.dateDebut).toContain("10-10-2021")
        expect(devoir.dateFin).toContain("11-11-2021")
        expect(devoir.visible).toContain("true")
        expect(devoir.id).toBe(1)
        expect(devoir.idEspaceCours).toContain("1")
        expect(devoir.noteMaximale).toBe("90")
        expect(devoir.remises.length).toBe(0)
    })
})

describe('Test des setters de la classe modele Devoir', () => {
    test("Creation d'un objet Devoir et validation des composantes", () => {

        devoir.nom = "devoirModifier";
        devoir.description = "haha";
        devoir.dateDebut = "10-01-2021";
        devoir.dateFin = "11-01-2021";
        devoir.visible = "false";
        devoir.id = 10;
        devoir.idEspaceCours = "10";
        devoir.noteMaximale = "100";

        expect(devoir.nom).toContain("devoirModifier")
        expect(devoir.description).toContain("haha")
        expect(devoir.dateDebut).toContain("10-01-2021")
        expect(devoir.dateFin).toContain("11-01-2021")
        expect(devoir.visible).toContain("false")
        expect(devoir.id).toBe(10)
        expect(devoir.idEspaceCours).toContain("10")
        expect(devoir.noteMaximale).toBe("100")

    })
})

describe('Test de la methode modifier de la classe modele Devoir', () => {
    test("Creation d'un objet Devoir, utilisation de la methode modifier et validation des composantes", () => {

        const DEVOIR2 = '{"nom":"devoir2","idEspaceCours":"2","description":"ceci est une description 2","noteMaximale":"99","dateDebut":"10-04-2021","dateFin":"11-04-2021","visible":"false"}';
        devoir.modifier(DEVOIR2);
        expect(devoir.nom).toContain("devoir2")
        expect(devoir.description).toContain("ceci est une description 2")
        expect(devoir.dateDebut).toContain("10-04-2021")
        expect(devoir.dateFin).toContain("11-04-2021")
        expect(devoir.visible).toContain("false")
        expect(devoir.id).toBe(1)
        expect(devoir.idEspaceCours).toContain("2")
        expect(devoir.noteMaximale).toBe("99")
    })
})