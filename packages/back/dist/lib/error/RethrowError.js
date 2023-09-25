"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RethrowError = void 0;
const api_1 = require("@edmp/api");
/**
 * This class is used to rethrow a technical error with code 500 (http status)
 * and keep original stack in data
 */
class RethrowError extends api_1.ServerError {
    constructor(error, data = {}) {
        // Set original stack in data error
        super(error.message, 500, api_1.EnumErrors.RethrowError, Object.assign({ originalStack: error.stack }, data));
    }
}
exports.RethrowError = RethrowError;
//# sourceMappingURL=RethrowError.js.map