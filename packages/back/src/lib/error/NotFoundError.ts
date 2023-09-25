import { ServerError, EnumErrors } from "@edmp/api";
/**
 * This class is used to throw a technical error with code 404 (http status) when resource is not found
 */
export class NotFoundError extends ServerError {
  constructor(message: string, data: Record<string, unknown> = {}) {
    super(message, 404, EnumErrors.NotFound, data);
  }
}
