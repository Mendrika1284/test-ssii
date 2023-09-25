"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnavailableError = void 0;
const api_1 = require("@edmp/api");
/**
 * This class is used to throw a technical error with code 503 (http status)
 */
class UnavailableError extends api_1.ServerError {
    constructor(message, type, data = {}) {
        super(message, 503, type, data);
    }
}
exports.UnavailableError = UnavailableError;
//# sourceMappingURL=UnavailableError.js.map