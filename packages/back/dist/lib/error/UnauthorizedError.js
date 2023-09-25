"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = void 0;
const api_1 = require("@edmp/api");
/**
 * This class is used to throw a technical error with code 401 (http status)
 */
class UnauthorizedError extends api_1.ServerError {
    constructor(message, data = {}) {
        super(message, 401, api_1.EnumErrors.UnauthorizedError, data);
    }
}
exports.UnauthorizedError = UnauthorizedError;
//# sourceMappingURL=UnauthorizedError.js.map