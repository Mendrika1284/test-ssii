"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = void 0;
const ExtendableError_1 = require("./ExtendableError");
/**
 * This class is used to throw technical error with o
 *
 * It completes Error (name, message, stack) with additional data existing in MoleculerError
 */
class ServerError extends ExtendableError_1.ExtendableError {
    constructor(message, code = 500, type, data = {}) {
        // Init MoleculerError
        super(message, code, type, Object.assign({ type }, data));
    }
}
exports.ServerError = ServerError;
//# sourceMappingURL=ServerError.js.map