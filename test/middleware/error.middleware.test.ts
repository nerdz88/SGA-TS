import 'jest-extended';
import { HttpError } from '../../src/core/errors/HttpError';
import errorMiddleware from '../../src/core/middleware/error.middleware';

let PATH_PRIVATE_PAGE = "/";
let PATH_PRIVATE_API = "/api/v1/enseignant/cours";

beforeEach(() => {
    //Permet de ne pas afficher les console.error du middleware.error.ts
    jest.spyOn(console, 'error').mockImplementation(() => { });
});


describe('Error middleware Test ', () => {
    let mockRequest;
    let mockResponse;
    let nextFunction;
    let error;
    let mockStatus = jest.fn();
    let mockSend = jest.fn();
    mockStatus.mockReturnValue({ send: mockSend })

    beforeEach(() => {
        mockRequest = {
            session: {}
        };
        mockResponse = {
            redirect: jest.fn(),
            status: mockStatus
        }
        nextFunction = jest.fn();
        error = new HttpError("Erreur pour test error middleware");
    });

    it("Page - Next function to be call", () => {
        mockRequest.url = PATH_PRIVATE_PAGE;
        errorMiddleware(error, mockRequest, mockResponse, nextFunction);
        expect(nextFunction).toBeCalledTimes(1);
    });

    it("API - Status send to be call", () => {
        mockRequest.url = PATH_PRIVATE_API;
        errorMiddleware(error, mockRequest, mockResponse, nextFunction);
        expect(mockResponse.status).toBeCalledTimes(1);
        expect(mockSend).toBeCalledTimes(1);
    });
})

