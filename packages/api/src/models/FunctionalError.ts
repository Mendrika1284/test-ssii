// List of error types
import { ErrorInterface } from "./ErrorInterface";

export const USER_ERROR = "USER_ERROR";

// List of errors
export enum EnumErrors {
  // Technical errors
  InvalidParameter = "invalid-parameter",
  NotFound = "not-found",
  ForbiddenError = "forbidden-error",
  UnauthorizedError = "unauthorized-error",
  ValidationError = "validation-error",
  RethrowError = "rethrow-error",

  // User Error
  TosAcceptRequired = "tos-accept-required",
}

/**
 * This interface is used to throw error functional (4XX)
 *
 * Functional errors are business error used when rules are not validated
 */
export interface FunctionalError extends ErrorInterface {
  error: string; // See list of errors in EnumErrors
}
