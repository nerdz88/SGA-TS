export class SgbError extends Error {
    private _code: number = 414;

    constructor(message :string) {
        super(message);
    }

    get code() {
        return this._code;
    }
}