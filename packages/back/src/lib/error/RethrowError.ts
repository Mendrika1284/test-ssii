import { ServerError, EnumErrors } from "@edmp/api";

/**
 * This class is used to rethrow a technical error with code 500 (http status)
 * and keep original stack in data
 */
export class RethrowError extends ServerError {
  constructor(error: Error, data: Record<string, any> = {}) {
    // Set original stack in data error
    super(error.message, 500, EnumErrors.RethrowError, Object.assign({ originalStack: error.stack }, data));
  }
}
