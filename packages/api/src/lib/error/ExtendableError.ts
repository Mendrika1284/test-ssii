import { ErrorInterface } from "../../models/ErrorInterface";

/**
 * Extendable errors class.
 *
 */
export class ExtendableError extends Error implements ErrorInterface {
  code: number; // 500, 401, 403, 40
  type: string; // See list of error types
  data: Record<string, any>;

  constructor(message: string, code = 500, type: string, data: Record<string, unknown> = {}) {
    super(message);
    this.code = code || 500;
    this.type = type;
    this.data = data;
  }
}
