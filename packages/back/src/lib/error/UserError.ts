import { BusinessError, USER_ERROR } from "@edmp/api";

/**
 * This class is used to throw error of Subscription
 */
export class UserError extends BusinessError {
  constructor(message: string, error: string, data = {}) {
    super(message, USER_ERROR, error, data);
  }
}
