"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
const api_1 = require("@edmp/api");
/**
 * This class is used to throw a technical error with code 422 (http status)
 */
class ValidationError extends api_1.ServerError {
    constructor(message, data = {}) {
        super(message, 422, api_1.EnumErrors.ValidationError, data);
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=ValidationError.js.map