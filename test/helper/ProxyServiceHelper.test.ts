import 'jest-extended';
import {universite} from "../../src/App";
import {LocalStorageHelper} from "../../src/core/helper/LocalStorageHelper";
import {ProxyServiceHelper} from "../../src/core/helper/ProxyServiceHelper";

const noteDevoirJSON1 = {
    "token": "test",
    "idEspaceCours": 1,
    "type": "test",
    "type_id" : 1,
    "note": 90,
    "studentId": 1
};

describe('Test ajouterNoteEtudiantService du PoxyServiceHelper', () => {
    test("cette methode va push des donner dans un service local, si le SGB est down ou dans le SGB", () => {
        // Test lorsque le SGBservice est online
        ProxyServiceHelper.ajouterNoteEtudiantService("59ff383eb192b445796a2826172e6545", 3, "devoir", 2, 34, 2).then( reponse => {
            expect(reponse.ok).toBe(true);
        });
    })
})

describe('Test persistData du PoxyServiceHelper', () => {
    test("cette methode va push des donner dans un service local", () => {
        // Test lorsque le SGBservice est online
        ProxyServiceHelper.persistData("59ff383eb192b445796a2826172e6545", 3, "devoir", 2, 34, 2);
        let data = LocalStorageHelper.getData(0);
        expect(data.token).toBe("59ff383eb192b445796a2826172e6545");
        expect(data.idEspaceCours).toBe(3);
        expect(data.type).toBe("devoir");
        expect(data.type_id).toBe(2);
        expect(data.note).toBe(34);
        expect(data.studentId).toBe(2);
        LocalStorageHelper.clearData();
    })
})

describe('Test la creation de scheduledJob du PoxyServiceHelper', () => {
    test("cette methode va creer un cron timer qui va constament essayer de push l'information du service local dans le SGB", () => {
        // Test lorsque le SGBservice est online
        ProxyServiceHelper.persistData("59ff383eb192b445796a2826172e6545", 3, "devoir", 2, 34, 2);
        ProxyServiceHelper.scheduleSGBFallbackJob();
        expect(ProxyServiceHelper.getTasks().length).toBe(1)
        LocalStorageHelper.clearData();
    })
})