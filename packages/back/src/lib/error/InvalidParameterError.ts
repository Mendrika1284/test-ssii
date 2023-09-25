import { EnumErrors, ServerError } from "@edmp/api";

/**
 * This class is used to throw a technical error with code 500 (http status)
 * when invalid parameter is detected in service
 */
export class InvalidParameterError extends ServerError {
  constructor(message: string, data = {}) {
    super(message, 400, EnumErrors.InvalidParameter, data);
  }
}
