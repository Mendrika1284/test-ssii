import { IncomingMessage } from "connect";
import { Context, Service, ServiceBroker } from "moleculer";
import GlobalRoute from "./global.route";

/**
 * Expose route to /meta path
 */
export default class MetaRoute extends Service {
  public constructor(broker: ServiceBroker) {
    super(broker);

    this.parseServiceSchema({
      name: "route.meta",
      mixins: [new GlobalRoute(broker).originalSchema],

      // More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
      settings: {
        routes: [
          {
            name: "meta-route",

            // First Route
            // The mixins logic merge the settings of GlobalRoute, so first route will be merged with the default route.
            path: "/meta/v1",

            // Only 'name: controller.**' services will be valid for this route
            whitelist: ["controller.user-accounts.**"],

            aliases: {
              "GET /login": "controller.user-accounts.login.get",
              "POST /renew": "controller.user-accounts.login.renew",
              "POST /logout": "controller.user-accounts.logout",
            },
          },
          {
            name: "meta-route-public",

            // Second route is for Public API
            // Mixin is not merger with global route
            // https://github.com/moleculerjs/moleculer-web/issues/101
            path: "/meta/v1",

            // Only 'name: controller.**' services will be valid for this route
            whitelist: ["controller.user-accounts.**"],

            authentication: false,

            bodyParsers: {
              json: true,
            },

            onBeforeCall(
              ctx: Context<Record<string, unknown>, { device: string | unknown }>,
              route: Record<string, unknown>,
              req: IncomingMessage & { method: string; url: string }
            ) {
              // We save Header, we need to retrieve user-agent in login Action
              // https://github.com/moleculerjs/moleculer-web/issues/117
              ctx.meta.device = req.headers["user-agent"];
            },

            // Public route for anonymous role
            aliases: {
              "POST /login": "controller.user-accounts.login",
            },
          },
        ],
      },
    });
  }
}
