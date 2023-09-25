"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessError = void 0;
const ExtendableError_1 = require("./ExtendableError");
/**
 * This class is used to throw a business error with code 400 (http status)
 */
class BusinessError extends ExtendableError_1.ExtendableError {
    constructor(message, type, error = "unknown", data = {}) {
        super(message, 400, type, Object.assign({ error }, data));
        this.error = error;
    }
}
exports.BusinessError = BusinessError;
//# sourceMappingURL=BusinessError.js.map