import { Context, Service, ServiceBroker } from "moleculer";
import GlobalRoute from "./global.route";
import { IncomingMessage } from "http";

/**
 * Expose route to /api path
 */
export default class ApiRoute extends Service {
  public constructor(broker: ServiceBroker) {
    super(broker);

    this.parseServiceSchema({
      name: "route.api",
      mixins: [new GlobalRoute(broker).originalSchema],

      // More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
      settings: {
        routes: [
          {
            name: "api-route",

            path: "/api/v1",

            // Only 'name: controller.**' services will be valid for this route
            whitelist: ["controller.**"],

            /**
             * Routes
             * https://moleculer.services/docs/0.14/moleculer-web.html#Aliases
             */
            aliases: {
              // User accounts
              "GET /user-accounts/:id": "controller.user-accounts.get",
              "PUT /user-accounts/:id": "controller.user-accounts.update",

              // Users
              "GET /users/:id": "controller.users.get",
              "PUT /users/:id": "controller.users.update",
              "POST /users/:id/accept-tos": "controller.users.acceptTos",

              // Examples
              "POST /examples": "controller.examples.create",
              "GET /examples": "controller.examples.list",
              "GET /examples/:id": "controller.examples.get",
              "PUT /examples/:id": "controller.examples.update",
              "DELETE /examples/:id": "controller.examples.delete",
            },
          },
          {
            name: "api-route-public",

            // Second route is for Public API
            // Mixin is not merger with global route
            // https://github.com/moleculerjs/moleculer-web/issues/101
            path: "/api/v1",

            // Only 'name: controller.**' services will be valid for this route
            whitelist: ["controller.**"],

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
              "POST /user-accounts": "controller.user-accounts.create",
            },
          },
        ],
      },
    });
  }
}
