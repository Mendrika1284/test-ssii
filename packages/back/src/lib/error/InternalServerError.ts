import { ServerError } from "@edmp/api";

/**
 * This class is used to throw a technical error with code 500 (http status)
 */
export class InternalServerError extends ServerError {
  constructor(message: string, type: string, data: Record<string, any> = {}) {
    super(message, 500, type, data);
  }
}
