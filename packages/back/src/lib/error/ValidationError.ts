import { ServerError, EnumErrors } from "@edmp/api";

/**
 * This class is used to throw a technical error with code 422 (http status)
 */
export class ValidationError extends ServerError {
  constructor(message: string, data: Record<string, any> = {}) {
    super(message, 422, EnumErrors.ValidationError, data);
  }
}
