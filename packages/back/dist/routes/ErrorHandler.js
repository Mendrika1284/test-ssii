"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrorMessage = exports.logErrorMessage = exports.getErrorMessage = void 0;
const http = __importStar(require("http"));
/**
 * Reformat error in JSON and complete data
 *
 * @param err Current error
 */
function getErrorMessage(err) {
    var _a, _b, _c, _d;
    // If code is empty or invalid we set a 500 error
    err.code = err.code in http.STATUS_CODES ? err.code : 500;
    let jsonMessage;
    const defaultErrorMessage = "Désolé ce service est temporairement indisponible.";
    if (err.code < 500) {
        // Functional message
        jsonMessage = JSON.stringify({
            message: err.message,
            data: err.data,
            type: err.type,
            code: err.code,
            error: (_b = (_a = err === null || err === void 0 ? void 0 : err.data) === null || _a === void 0 ? void 0 : _a.error) !== null && _b !== void 0 ? _b : "",
        });
    }
    else {
        // Technical message
        jsonMessage = JSON.stringify({
            message: (_c = err.message) !== null && _c !== void 0 ? _c : defaultErrorMessage,
            data: err.data,
            type: err.type,
            code: (_d = err.code) !== null && _d !== void 0 ? _d : 500,
        });
    }
    return jsonMessage;
}
exports.getErrorMessage = getErrorMessage;
function logErrorMessage(service, err) {
    var _a;
    // If code is empty we set a 500 error
    err.code = (_a = err.code) !== null && _a !== void 0 ? _a : 500;
    // Copy type in originalType because moleculer override type with Exception type (ie: ValidationError)
    err.originalType = err.type;
    if (err.code >= 500 || err.code === 409) {
        // Server Error
        service.logger.error({ err }, `ErrorHandler`);
    }
    else {
        // Functional Error
        service.logger.warn({ err }, `ErrorHandler`);
    }
}
exports.logErrorMessage = logErrorMessage;
function sendErrorMessage(service, err, res) {
    var _a;
    // If code is empty we set a 500 error
    err.code = (_a = err.code) !== null && _a !== void 0 ? _a : 500;
    logErrorMessage(service, err);
    const message = getErrorMessage(err);
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Content-Type", "application/json");
    res.writeHead(err.code);
    res.end(message);
}
exports.sendErrorMessage = sendErrorMessage;
//# sourceMappingURL=ErrorHandler.js.map