import { HttpError } from "./HttpError";

export class SgbError extends HttpError {
    constructor(message: string) {
        super(message);
    } 
}