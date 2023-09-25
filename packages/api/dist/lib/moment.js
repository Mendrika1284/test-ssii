"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMoment = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
require("moment/locale/fr");
const ServerError_1 = require("./error/ServerError");
/**
 * @description Use this with empty param for just set TZ on Europe/Paris by default
 * @param inp Input
 * @param format Format
 * @param language By default "fr"
 * forgiving parsing, see the [parsing guide](https://momentjs.com/guides/#/parsing/).
 */
function getMoment(inp, format, language) {
    moment_timezone_1.default.locale("fr");
    moment_timezone_1.default.tz.setDefault("Europe/Paris");
    const initiatedMoment = (0, moment_timezone_1.default)(inp, format, language, true);
    if (initiatedMoment.isValid()) {
        return initiatedMoment;
    }
    throw new ServerError_1.ServerError(initiatedMoment.toString(), 500, "MomentError", { momentInput: inp });
}
exports.getMoment = getMoment;
//# sourceMappingURL=moment.js.map