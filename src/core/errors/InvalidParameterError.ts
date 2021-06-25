import { HttpError } from "./HttpError";

/**
 * @see Applying UML and Patterns, Chapter A35/F30
 */
export class InvalidParameterError extends HttpError {
    constructor(message: string) {
        super(message, 400);
    } 
}