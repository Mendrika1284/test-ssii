import { ServerError, EnumErrors } from "@edmp/api";
/**
 * This class is used to throw a technical error with code 403 (http status)
 */
export class ForbiddenError extends ServerError {
  constructor(message: string, data: Record<string, unknown> = {}) {
    super(message, 403, EnumErrors.ForbiddenError, data);
  }
}
