import { ServiceCustom } from "moleculer";

declare module "cron" {
  import "cron";

  interface CronJobParametersCustom<Service extends ServiceCustom>
    extends Omit<CronJobParameters, "context" | "runOnInit" | "onTick"> {
    /**
     * @default uild()
     */
    name?: string;
    /**
     * @default false
     */
    manualStart?: boolean;
    /**
     * @default 'Europe/Paris'
     */
    timeZone?: string | undefined;
    onTick: (this: Service) => Promise<void>;
  }

  class CronJobCustom<Service extends ServiceCustom> extends CronJob {
    constructor(
      options: RequireField<CronJobParametersCustom<Service>, "name" | "manualStart" | "timeZone"> & {
        context: Service;
      }
    ): CronJobCustom;
    name: string;
    manualStart: boolean;
    context: Service;
  }
}
