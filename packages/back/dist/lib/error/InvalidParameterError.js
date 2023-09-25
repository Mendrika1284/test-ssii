"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidParameterError = void 0;
const api_1 = require("@edmp/api");
/**
 * This class is used to throw a technical error with code 500 (http status)
 * when invalid parameter is detected in service
 */
class InvalidParameterError extends api_1.ServerError {
    constructor(message, data = {}) {
        super(message, 400, api_1.EnumErrors.InvalidParameter, data);
    }
}
exports.InvalidParameterError = InvalidParameterError;
//# sourceMappingURL=InvalidParameterError.js.map