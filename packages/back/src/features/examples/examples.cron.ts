import { CronMixin, MailerMixin } from "@/mixins";
import { MoleculerLib } from "@/lib";
import { IExamplesCron } from "@/interfaces";

const ExampleCron: IExamplesCron.ServiceSchema = {
  name: "cron.examples",

  mixins: [CronMixin, MailerMixin],

  crons: [
    {
      name: "job.test",
      //cronTime: "* * * * *", // Every min
      cronTime: "0 0 */1 * *", // At 00:00 every day.
      onTick: async function (): Promise<void> {
        try {
          const ctx = MoleculerLib.createContext<IExamplesCron.Context<"cron.examples.job.test">>(
            this,
            "event",
            "cron.examples.job.test"
          );
          await ctx.call("cron.examples.test");
        } catch (err) {
          this.logger.error({ err }, "CronJob Error");
        }
      },
      timeZone: "Europe/Paris",
    },
  ],

  actions: {
    test: {
      handler: async function (ctx) {
        const example = await ctx.call("service.examples.list");
        this.logger.info({ example });
      },
    },
  },
};

export default ExampleCron;
export { ExampleCron };
