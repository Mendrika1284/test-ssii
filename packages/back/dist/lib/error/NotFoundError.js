"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const api_1 = require("@edmp/api");
/**
 * This class is used to throw a technical error with code 404 (http status) when resource is not found
 */
class NotFoundError extends api_1.ServerError {
    constructor(message, data = {}) {
        super(message, 404, api_1.EnumErrors.NotFound, data);
    }
}
exports.NotFoundError = NotFoundError;
//# sourceMappingURL=NotFoundError.js.map