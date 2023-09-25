"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleCron = void 0;
const mixins_1 = require("@/mixins");
const lib_1 = require("@/lib");
const ExampleCron = {
    name: "cron.examples",
    mixins: [mixins_1.CronMixin, mixins_1.MailerMixin],
    crons: [
        {
            name: "job.test",
            //cronTime: "* * * * *", // Every min
            cronTime: "0 0 */1 * *",
            onTick: function () {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const ctx = lib_1.MoleculerLib.createContext(this, "event", "cron.examples.job.test");
                        yield ctx.call("cron.examples.test");
                    }
                    catch (err) {
                        this.logger.error({ err }, "CronJob Error");
                    }
                });
            },
            timeZone: "Europe/Paris",
        },
    ],
    actions: {
        test: {
            handler: function (ctx) {
                return __awaiter(this, void 0, void 0, function* () {
                    const example = yield ctx.call("service.examples.list");
                    this.logger.info({ example });
                });
            },
        },
    },
};
exports.ExampleCron = ExampleCron;
exports.default = ExampleCron;
//# sourceMappingURL=examples.cron.js.map