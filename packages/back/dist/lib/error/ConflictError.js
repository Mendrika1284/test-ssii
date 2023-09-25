"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = void 0;
const api_1 = require("@edmp/api");
/**
 * This class is used to throw a technical error with code 409 (http status)
 */
class ConflictError extends api_1.ServerError {
    constructor(message, type, data = {}) {
        super(message, 500, type, data);
    }
}
exports.ConflictError = ConflictError;
//# sourceMappingURL=ConflictError.js.map