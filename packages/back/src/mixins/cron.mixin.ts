/*
 * moleculer-cron
 * - https://github.com/davidroman0O/moleculer-cron
 */
import { CronJob, CronJobParametersCustom, CronTime } from "cron";
import { ICronMixin } from "@/interfaces";
import { ServiceCustom } from "moleculer";
import { RequireField } from "@edmp/api";
import { ulid } from "ulid";

class CronJobCustom<Service extends ServiceCustom> extends CronJob {
  name: string;
  manualStart: boolean;
  context: Service;
  constructor(
    options: RequireField<CronJobParametersCustom<Service>, "name" | "manualStart" | "timeZone"> & { context: Service }
  ) {
    super(options);
    this.name = options.name;
    this.manualStart = options.manualStart;
    this.context = options.context;
  }
}

export const CronMixin: ICronMixin.ServiceSchema = {
  name: "mixin.cron",

  settings: {
    cronJobs: [],
  },

  methods: {
    // Find a job by name
    getJob(name: string) {
      return this.settings.cronJobs.find((job) => job.name && job.name == name);
    },

    makeId() {
      return ulid();
    },

    // Get a Cron time
    getCronTime(time) {
      return new CronTime(time);
    },
  },

  created() {
    if ((this as unknown as ICronMixin.Service).schema.crons) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.settings.cronJobs = (this as unknown as ICronMixin.Service).schema.crons!.map((jobParam) => {
        //	Just add the broker to handle actions and methods from other services
        const job = new CronJobCustom<ICronMixin.Service>({
          ...jobParam,
          name: jobParam.name || (this as unknown as ICronMixin.Service).makeId(),
          manualStart: jobParam.manualStart || false,
          timeZone: jobParam.timeZone || "Europe/Paris",
          context: this as unknown as ICronMixin.Service,
        });
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
      } catch (error) {
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
