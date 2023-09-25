"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserError = void 0;
const api_1 = require("@edmp/api");
/**
 * This class is used to throw error of Subscription
 */
class UserError extends api_1.BusinessError {
    constructor(message, error, data = {}) {
        super(message, api_1.USER_ERROR, error, data);
    }
}
exports.UserError = UserError;
//# sourceMappingURL=UserError.js.map