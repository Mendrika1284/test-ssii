"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = void 0;
const api_1 = require("@edmp/api");
/**
 * This class is used to throw a technical error with code 403 (http status)
 */
class ForbiddenError extends api_1.ServerError {
    constructor(message, data = {}) {
        super(message, 403, api_1.EnumErrors.ForbiddenError, data);
    }
}
exports.ForbiddenError = ForbiddenError;
//# sourceMappingURL=ForbiddenError.js.map