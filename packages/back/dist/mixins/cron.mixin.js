"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronMixin = void 0;
/*
 * moleculer-cron
 * - https://github.com/davidroman0O/moleculer-cron
 */
const cron_1 = require("cron");
const ulid_1 = require("ulid");
class CronJobCustom extends cron_1.CronJob {
    constructor(options) {
        super(options);
        this.name = options.name;
        this.manualStart = options.manualStart;
        this.context = options.context;
    }
}
exports.CronMixin = {
    name: "mixin.cron",
    settings: {
        cronJobs: [],
    },
    methods: {
        // Find a job by name
        getJob(name) {
            return this.settings.cronJobs.find((job) => job.name && job.name == name);
        },
        makeId() {
            return (0, ulid_1.ulid)();
        },
        // Get a Cron time
        getCronTime(time) {
            return new cron_1.CronTime(time);
        },
    },
    created() {
        if (this.schema.crons) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.settings.cronJobs = this.schema.crons.map((jobParam) => {
                //	Just add the broker to handle actions and methods from other services
                const job = new CronJobCustom(Object.assign(Object.assign({}, jobParam), { name: jobParam.name || this.makeId(), manualStart: jobParam.manualStart || false, timeZone: jobParam.timeZone || "Europe/Paris", context: this }));
                return job;
            });
        }
    },
    started() {
        this.settings.cronJobs.map((job) => {
            try {
                if (!job.manualStart) {
                    job.start();
                }
            }
            catch (error) {
                this.logger.error("Start Cron - ", job.name);
            }
        });
    },
    stopped() {
        this.settings.cronJobs.map((job) => {
            job.stop();
        });
    },
};
//# sourceMappingURL=cron.mixin.js.map