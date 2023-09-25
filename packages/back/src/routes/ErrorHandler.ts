import { ServerResponse } from "http";
import Moleculer, { Service } from "moleculer";
import { FunctionalError, ServerError } from "@edmp/api";
import MoleculerError = Moleculer.Errors.MoleculerError;
import * as http from "http";

/**
 * Reformat error in JSON and complete data
 *
 * @param err Current error
 */
export function getErrorMessage(err: {
  code: number;
  type: string;
  message: string;
  data: Record<string, string>;
}): string {
  // If code is empty or invalid we set a 500 error
  err.code = err.code in http.STATUS_CODES ? err.code : 500;

  let jsonMessage;
  const defaultErrorMessage = "Désolé ce service est temporairement indisponible.";

  if (err.code < 500) {
    // Functional message
    jsonMessage = JSON.stringify({
      message: err.message,
      data: err.data,
      type: err.type,
      code: err.code,
      error: err?.data?.error ?? "",
    } as FunctionalError);
  } else {
    // Technical message
    jsonMessage = JSON.stringify({
      message: err.message ?? defaultErrorMessage,
      data: err.data,
      type: err.type,
      code: err.code ?? 500,
    } as ServerError);
  }

  return jsonMessage;
}

export function logErrorMessage(service: Service, err: { code: number; type: string; originalType?: string }): void {
  // If code is empty we set a 500 error
  err.code = err.code ?? 500;
  // Copy type in originalType because moleculer override type with Exception type (ie: ValidationError)
  err.originalType = err.type;

  if (err.code >= 500 || err.code === 409) {
    // Server Error
    service.logger.error({ err }, `ErrorHandler`);
  } else {
    // Functional Error
    service.logger.warn({ err }, `ErrorHandler`);
  }
}

export function sendErrorMessage(service: Service, err: MoleculerError, res: ServerResponse): void {
  // If code is empty we set a 500 error
  err.code = err.code ?? 500;

  logErrorMessage(service, err);

  const message = getErrorMessage(err);

  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Content-Type", "application/json");
  res.writeHead(err.code);
  res.end(message);
}
