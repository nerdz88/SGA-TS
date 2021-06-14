/**
 * @see Applying UML and Patterns, Chapter A35/F30
 */
export class UnauthorizedError extends Error {
    private _code: number = 401;

    constructor() {
        super("Accès refusé : Vous devez vous connecter");
    }

    get code() {
        return this._code;
    }
}