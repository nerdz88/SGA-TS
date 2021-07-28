import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';

// Singleton ?
export class LocalStorageHelper {
    static db;

    private static initPersistentLocalDB() {
        this.db = new JsonDB(new Config("noteDevoir", true, true, '/'));
    }

    public static pushData(noteDevoirJSON: { studentId: number; note: number; idEspaceCours: number; type_id: number; type: string }) {
        if (this.db == null) {
            this.initPersistentLocalDB();
        }
        LocalStorageHelper.pushNoteDevoir(noteDevoirJSON);
    }

    private static pushNoteDevoir(noteDevoirJSON: { studentId: number; note: number; idEspaceCours: number; type_id: number; type: string }) {
        this.db.push("/data/NoteDevoir[]", noteDevoirJSON);
    }


    public static getData(index: number) {
        return this.db.getData('/data/NoteDevoir[' + index + ']');
    }

    public static getDataCount() {
        return this.db.count("/data/NoteDevoir");
    }

    public static clearData() {
        this.db.delete("/data");
    }


}