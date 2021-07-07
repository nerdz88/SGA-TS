import 'jest-extended';
import { UnauthorizedError } from '../../src/core/errors/UnauthorizedError';
import authMiddleware from '../../src/core/middleware/auth.middleware';

let PATH_PUBLIC_RESSOURCE_FILE = "/css/materialStyle.css";
let PATH_PUBLIC_PAGE = "/login";
let PATH_PRIVATE_PAGE = "/";
let PATH_PRIVATE_API = "/api/v1/enseignant/cours";


describe('Auth middleware Test - NOT Login', () => {
    let mockRequest;
    let mockResponse;
    let nextFunction;

    beforeEach(() => {
        mockRequest = {
            session: {}
        };
        mockResponse = {
            redirect: jest.fn()
        }
        nextFunction = jest.fn();
    });

    it("Publique file - Next function to be call", () => {
        mockRequest.url = PATH_PUBLIC_RESSOURCE_FILE;
        authMiddleware(mockRequest, mockResponse, nextFunction);
        expect(nextFunction).toBeCalledTimes(1);
    });

    it("Publique page - Next function to be call", () => {
        mockRequest.url = PATH_PUBLIC_PAGE;
        authMiddleware(mockRequest, mockResponse, nextFunction);
        expect(nextFunction).toBeCalledTimes(1);
    });

    it("Priavate page - Redirect function to be call", () => {
        mockRequest.url = PATH_PRIVATE_PAGE;
        authMiddleware(mockRequest, mockResponse, nextFunction);
        expect(mockResponse.redirect).toBeCalledTimes(1);
    });

    it("Priavate API - UnauthorizedError", () => {
        mockRequest.url = PATH_PRIVATE_API;
        expect(() => {
            authMiddleware(mockRequest, mockResponse, nextFunction);
        }).toThrow(UnauthorizedError);
    });
})

describe('Auth middleware Test - Login', () => {
    let mockRequest;
    let mockResponse;
    let nextFunction;

    beforeEach(() => {
        mockRequest = {
            session: {
                token: "123"
            }
        };
        mockResponse = {
            redirect: jest.fn()
        }
        nextFunction = jest.fn();
    });

    it("Publique file - Next function to be call", () => {
        mockRequest.url = PATH_PUBLIC_RESSOURCE_FILE;
        authMiddleware(mockRequest, mockResponse, nextFunction);
        expect(nextFunction).toBeCalledTimes(1);
    });

    it("Publique page - Next function to be call", () => {
        mockRequest.url = PATH_PUBLIC_PAGE;
        authMiddleware(mockRequest, mockResponse, nextFunction);
        expect(nextFunction).toBeCalledTimes(1);
    });

    it("Priavate page -  Next function to be call", () => {
        mockRequest.url = PATH_PRIVATE_PAGE;
        authMiddleware(mockRequest, mockResponse, nextFunction);
        expect(nextFunction).toBeCalledTimes(1);
    });

    it("Priavate API -  Next function to be call", () => {
        mockRequest.url = PATH_PRIVATE_API;
        authMiddleware(mockRequest, mockResponse, nextFunction);
        expect(nextFunction).toBeCalledTimes(1);
    });
})


