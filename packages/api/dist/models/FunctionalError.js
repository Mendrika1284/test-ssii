"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumErrors = exports.USER_ERROR = void 0;
exports.USER_ERROR = "USER_ERROR";
// List of errors
var EnumErrors;
(function (EnumErrors) {
    // Technical errors
    EnumErrors["InvalidParameter"] = "invalid-parameter";
    EnumErrors["NotFound"] = "not-found";
    EnumErrors["ForbiddenError"] = "forbidden-error";
    EnumErrors["UnauthorizedError"] = "unauthorized-error";
    EnumErrors["ValidationError"] = "validation-error";
    EnumErrors["RethrowError"] = "rethrow-error";
    // User Error
    EnumErrors["TosAcceptRequired"] = "tos-accept-required";
})(EnumErrors = exports.EnumErrors || (exports.EnumErrors = {}));
//# sourceMappingURL=FunctionalError.js.map