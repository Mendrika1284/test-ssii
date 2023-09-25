import { ErrorInterface } from "./ErrorInterface";
export declare const USER_ERROR = "USER_ERROR";
export declare enum EnumErrors {
    InvalidParameter = "invalid-parameter",
    NotFound = "not-found",
    ForbiddenError = "forbidden-error",
    UnauthorizedError = "unauthorized-error",
    ValidationError = "validation-error",
    RethrowError = "rethrow-error",
    TosAcceptRequired = "tos-accept-required"
}
/**
 * This interface is used to throw error functional (4XX)
 *
 * Functional errors are business error used when rules are not validated
 */
export interface FunctionalError extends ErrorInterface {
    error: string;
}
//# sourceMappingURL=FunctionalError.d.ts.map