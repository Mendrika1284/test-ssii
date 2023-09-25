import { ServerError } from "@edmp/api";

/**
 * This class is used to throw a technical error with code 503 (http status)
 */
export class UnavailableError extends ServerError {
  constructor(message: string, type: string, data: Record<string, unknown> = {}) {
    super(message, 503, type, data);
  }
}
