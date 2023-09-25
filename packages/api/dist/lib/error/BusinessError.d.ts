import { FunctionalError } from "../../models/FunctionalError";
import { ExtendableError } from "./ExtendableError";
/**
 * This class is used to throw a business error with code 400 (http status)
 */
export declare class BusinessError extends ExtendableError implements FunctionalError {
    error: string;
    constructor(message: string, type: string, error?: string, data?: Record<string, any>);
}
//# sourceMappingURL=BusinessError.d.ts.map