import { ServerError } from "@edmp/api";

/**
 * This class is used to throw a technical error with code 409 (http status)
 */
export class ConflictError extends ServerError {
  constructor(message: string, type: string, data: Record<string, unknown> = {}) {
    super(message, 500, type, data);
  }
}
