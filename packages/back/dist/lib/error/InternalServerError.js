"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = void 0;
const api_1 = require("@edmp/api");
/**
 * This class is used to throw a technical error with code 500 (http status)
 */
class InternalServerError extends api_1.ServerError {
    constructor(message, type, data = {}) {
        super(message, 500, type, data);
    }
}
exports.InternalServerError = InternalServerError;
//# sourceMappingURL=InternalServerError.js.map