import { FunctionalError } from "../../models/FunctionalError";
import { ExtendableError } from "./ExtendableError";

/**
 * This class is used to throw a business error with code 400 (http status)
 */
export class BusinessError extends ExtendableError implements FunctionalError {
  error: string;

  constructor(message: string, type: string, error = "unknown", data: Record<string, any> = {}) {
    super(message, 400, type, Object.assign({ error }, data));

    this.error = error;
  }
}
