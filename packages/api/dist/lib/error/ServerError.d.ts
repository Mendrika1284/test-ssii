import { TechnicalError } from "../../models/TechnicalError";
import { ExtendableError } from "./ExtendableError";
/**
 * This class is used to throw technical error with o
 *
 * It completes Error (name, message, stack) with additional data existing in MoleculerError
 */
export declare class ServerError extends ExtendableError implements TechnicalError {
    constructor(message: string, code: number | undefined, type: string, data?: Record<string, unknown>);
}
//# sourceMappingURL=ServerError.d.ts.map