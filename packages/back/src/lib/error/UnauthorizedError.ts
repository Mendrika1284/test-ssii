import { EnumErrors, ServerError } from "@edmp/api";
/**
 * This class is used to throw a technical error with code 401 (http status)
 */
export class UnauthorizedError extends ServerError {
  constructor(message: string, data: Record<string, unknown> = {}) {
    super(message, 401, EnumErrors.UnauthorizedError, data);
  }
}
