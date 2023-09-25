import { ErrorInterface } from "./ErrorInterface";

/**
 * This interface is used to throw technical error ( 500, 401, 403, 409)
 *
 * It completes Error (name, message, stack) with additional data existing in MoleculerError
 */
export type TechnicalError = ErrorInterface;
