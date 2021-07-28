import 'jest-extended';
import {LocalStorageHelper} from "../../src/core/helper/LocalStorageHelper";
import 'reflect-metadata';
import {DataError} from "node-json-db/dist/lib/Errors";

const noteDevoirJSON1 = {
    "token": "test",
    "idEspaceCours": 1,
    "type": "test",
    "type_id" : 1,
    "note": 90,
    "studentId": 1
};

const noteDevoirJSON2 = {
    "token": "test",
    "idEspaceCours": 2,
    "type": "test",
    "type_id" : 2,
    "note": 100,
    "studentId": 2
};


describe('Test pushData du localStorage', () => {
    test("Creation d'un objet NoteDevoir dans le storage local", () => {
        LocalStorageHelper.pushData(noteDevoirJSON1);
        LocalStorageHelper.clearData();
        LocalStorageHelper.pushData(noteDevoirJSON1);
        LocalStorageHelper.pushData(noteDevoirJSON2);
        expect(LocalStorageHelper.getDataCount()).toBe(2);
        LocalStorageHelper.clearData();
    })
})

describe('Test getData du localStorage', () => {
    test("Retrieve le data de la DB local", () => {
        LocalStorageHelper.pushData(noteDevoirJSON1);
        LocalStorageHelper.clearData();
        LocalStorageHelper.pushData(noteDevoirJSON1);
        let data = LocalStorageHelper.getData(0);
        expect(data.token).toBe("test");
        expect(data.idEspaceCours).toBe(1);
        expect(data.type).toBe("test");
        expect(data.type_id).toBe(1);
        expect(data.note).toBe(90);
        expect(data.studentId).toBe(1);
        LocalStorageHelper.clearData();
    })
})

// Test won't get the exception thrown idk why..... to check
/*describe('Test clearData du localStorage', () => {
    test("Reset les donnee dans la base", () => {
        LocalStorageHelper.pushData(noteDevoirJSON1);
        LocalStorageHelper.clearData();
        LocalStorageHelper.pushData(noteDevoirJSON1);
        LocalStorageHelper.pushData(noteDevoirJSON2);
        const t = () => {
            LocalStorageHelper.clearData();
        };
        expect(t).toThrow(DataError);
    })
})*/

