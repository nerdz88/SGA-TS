import 'jest-extended';

import { DevHelper } from '../../src/core/helper/DevHelper';
import app, { universite } from '../../src/App';
import * as fs from 'fs';
var session = require('supertest-session');
var testSession = session(app);
const COURSEVALUE1 = '{"_id":3,"_sigle":"LOG210","_nb_max_student":5,"_groupe":"01","_titre":"Analyse et conception de logiciels","_date_debut":"2019-09-01","_date_fin":"2019-09-02"}';
const PATH_DATA = "./src/data/cache/universiteTEST.json";


beforeEach((done) => {
    //Permet de ne pas afficher les console.error du middleware.error.ts
    jest.spyOn(console, 'error').mockImplementation(() => { });
    universite.reset();
    return done();
});


describe('DevHelper Test - NOT Login', () => {
    let mockedRequestLoginNormal;
    beforeAll((done) => {
        mockedRequestLoginNormal = {
            session: {},
            body: {
                email: "123",
            }
        };
        return done();
    });

    it("DevHelper - méthode avec mockedRequestLoginNormal", (done) => {
        expect(DevHelper.login(mockedRequestLoginNormal, PATH_DATA)).toBe(mockedRequestLoginNormal.body.email);
        expect(mockedRequestLoginNormal.session.isDevLoggedIn).toBeUndefined();
        DevHelper.saveData(mockedRequestLoginNormal)
        expect(universite.recupererTousEspaceCours(3)).toBeArrayOfSize(0);
        done();
    });
})

describe('DevHelper Test - Login - Dev - mock', () => {
    let mockedReqLoginDev;
    beforeEach((done) => {
        mockedReqLoginDev = {
            session: {},
            body: {
                email: "dev",
            }
        };
        return done();
    });

    it("DevHelper - méthode avec mockedRequestLoginNormal", (done) => {
        expect(DevHelper.login(mockedReqLoginDev, PATH_DATA)).toBe("teacher+3@gmail.com");
        expect(mockedReqLoginDev.session.isDevLoggedIn).toBeTrue();

        expect(DevHelper.login(mockedReqLoginDev, "/blabla/lobngfa.txt")).toBe("teacher+3@gmail.com");
        DevHelper.saveData(mockedReqLoginDev, "/blabla/lobngfa.txt");
        done();
    });
})


describe('DevHelper Test - Login - Dev', () => {

    var authenticatedSession;
    beforeAll((done) => {
        testSession.post('/api/v1/login')
            .send({ email: 'dev', password: '123' })
            .expect(200)
            .end(function (err) {
                if (err) return done(err);
                authenticatedSession = testSession;
                authenticatedSession.session = { isDevLoggedIn: true };
                universite.reset();
                return done();
            });
    });

    it("DevHelper - méthod save load universite ", async (done) => {
        expect(universite.recupererTousEspaceCours(3)).toBeArrayOfSize(0);

        await authenticatedSession.post('/api/v1/enseignant/cours/ajouter')
            .send({ data: COURSEVALUE1 });

        expect(universite.recupererTousEspaceCours(3)).toBeArrayOfSize(1);
        DevHelper.saveData(authenticatedSession, PATH_DATA);
        expect(fs.existsSync(PATH_DATA)).toBeTrue();
        universite.reset();
        expect(universite.recupererTousEspaceCours(3)).toBeArrayOfSize(0);
        DevHelper.loadData(PATH_DATA);
        expect(universite.recupererTousEspaceCours(3)).toBeArrayOfSize(1);
        try{
            fs.unlinkSync(PATH_DATA);
        }catch{}
   

        done();

    });


})
