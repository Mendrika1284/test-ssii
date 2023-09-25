"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moleculer_1 = require("moleculer");
const global_route_1 = __importDefault(require("./global.route"));
/**
 * Expose route to /api path
 */
class ApiRoute extends moleculer_1.Service {
    constructor(broker) {
        super(broker);
        this.parseServiceSchema({
            name: "route.api",
            mixins: [new global_route_1.default(broker).originalSchema],
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
                        onBeforeCall(ctx, route, req) {
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
exports.default = ApiRoute;
//# sourceMappingURL=api.route.js.map