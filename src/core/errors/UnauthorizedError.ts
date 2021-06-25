import { HttpError } from "./HttpError";

/**
 * @see Applying UML and Patterns, Chapter A35/F30
 */
export class UnauthorizedError extends HttpError {
    constructor() {
        super("Accès refusé : Vous devez vous connecter", 401);
    }
}