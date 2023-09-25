import { TechnicalError } from "../../models/TechnicalError";
import { ExtendableError } from "./ExtendableError";
/**
 * This class is used to throw technical error with o
 *
 * It completes Error (name, message, stack) with additional data existing in MoleculerError
 */
export class ServerError extends ExtendableError implements TechnicalError {
  constructor(message: string, code = 500, type: string, data: Record<string, unknown> = {}) {
    // Init MoleculerError
    super(message, code, type, Object.assign({ type }, data));
  }
}
