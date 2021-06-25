/**
 * @see Applying UML and Patterns, Chapter A35/F30
 */
 export class HttpError extends Error {
    protected _code: number;

    constructor(message: string, code?: number) {
        super(message);
        this._code = code ?? 500;
    }

    get code() {
        return this._code;
    }
}