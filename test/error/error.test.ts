import { AlreadyExistsError } from "../../src/core/errors/AlreadyExistsError"
import { InvalidParameterError } from "../../src/core/errors/InvalidParameterError"
import { NotFoundError } from "../../src/core/errors/NotFoundError"
import { SgbError } from "../../src/core/errors/SgbError"
import { UnauthorizedError } from "../../src/core/errors/UnauthorizedError"


describe("Test des classes d'erreur", () => {

    it("Devrais avoir les codes appropries pour les classes d'erreurs", ()=> {

        let alreadyExistError = new AlreadyExistsError("Already Exist Error")
        let invalidParameterError = new InvalidParameterError("Invalid Parameter Error")
        let notFoundError = new NotFoundError("Not Found Error")
        let sgbError = new SgbError("Sgb Error")
        let unauthorizedError = new UnauthorizedError()

        expect(alreadyExistError.message).toEqual("Already Exist Error")
        expect(invalidParameterError.message).toEqual("Invalid Parameter Error")
        expect(notFoundError.message).toEqual("Not Found Error")
        expect(sgbError.message).toEqual("Sgb Error")
        expect(unauthorizedError.message).toEqual("Accès refusé : Vous devez vous connecter")

        expect(alreadyExistError.code).toBe(400)
        expect(invalidParameterError.code).toBe(400)
        expect(notFoundError.code).toBe(404)
        expect(sgbError.code).toBe(414)
        expect(unauthorizedError.code).toBe(401)

    })

})