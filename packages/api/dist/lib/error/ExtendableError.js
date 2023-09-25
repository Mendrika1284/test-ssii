"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendableError = void 0;
/**
 * Extendable errors class.
 *
 */
class ExtendableError extends Error {
    constructor(message, code = 500, type, data = {}) {
        super(message);
        this.code = code || 500;
        this.type = type;
        this.data = data;
    }
}
exports.ExtendableError = ExtendableError;
//# sourceMappingURL=ExtendableError.js.map