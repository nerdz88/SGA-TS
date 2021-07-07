import 'jest-extended';
import { AuthorizationHelper } from '../../src/core/helper/AuthorizationHelper';


describe('AuthorizationHelper Test - NOT Login', () => {

    let mockedReqNotLogin;
    beforeAll(() => {
        mockedReqNotLogin = {
            session: {}
        };

        //Permet de ne pas afficher les console.error du middleware.error.ts
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });


    it("AuthorizationHelper - méthode avec mockedReq", () => {
        expect(AuthorizationHelper.isLoggedIn(mockedReqNotLogin)).toBeFalse();
        expect(AuthorizationHelper.isDevLoggedIn(mockedReqNotLogin)).toBeUndefined();
        expect(AuthorizationHelper.getCurrentToken(mockedReqNotLogin)).toBeUndefined();
        expect(AuthorizationHelper.getCurrentUserInfo(mockedReqNotLogin)).toBeUndefined();
        expect(() => {
            AuthorizationHelper.getIdUser(mockedReqNotLogin)
        }).toThrow(TypeError);
    });
})

describe('AuthorizationHelper Test - Login', () => {

    let mockedReqLogin;
    beforeEach(() => {
        mockedReqLogin = {
            session: {
                token: "123",
                isDevLoggedIn: false,
                user: {
                    _id: 1,
                    _nom: "test",
                }
            }
        };
    
        //Permet de ne pas afficher les console.error du middleware.error.ts
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });
    

    it("AuthorizationHelper - méthode avec mockedReq", () => {
        expect(AuthorizationHelper.isLoggedIn(mockedReqLogin)).toBeTrue();
        expect(AuthorizationHelper.isDevLoggedIn(mockedReqLogin)).toBeFalse();
        expect(AuthorizationHelper.getCurrentToken(mockedReqLogin)).toBe("123");
        expect(AuthorizationHelper.getCurrentUserInfo(mockedReqLogin)).toBe(mockedReqLogin.session.user);
        expect(AuthorizationHelper.getIdUser(mockedReqLogin)).toBe(1);
    });

})

