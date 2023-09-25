/**
 * This interface is used to specify error in our application
 *
 * It completes Error (name, message, stack) with additional data existing
 */
export interface ErrorInterface extends Error {
  code: number; // 500, 401, 403, 40
  type: string; // See list of error types
  data: Record<string, any>;
}
