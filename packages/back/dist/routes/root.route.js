/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moleculer_1 = require("moleculer");
const moleculer_web_1 = __importDefault(require("moleculer-web"));
const path_1 = __importDefault(require("path"));
const global_route_1 = __importDefault(require("./global.route"));
const backPackage = require("../../package.json");
const frontPackage = require("../../../front/package.json");
const apiPackage = require("../../../api/package.json");
/**
 *
 * Expose root route to /version path
 *
 * Authentification is disable for root route
 */
class RootRoute extends moleculer_1.Service {
    constructor(broker) {
        super(broker);
        this.parseServiceSchema({
            name: "route.root",
            mixins: [new global_route_1.default(broker).originalSchema],
            // More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
            settings: {
                routes: [
                    {
                        name: "root-route-public",
                        path: "/",
                        // Disable authentication.
                        authentication: false,
                        use: [
                            // Serve static
                            moleculer_web_1.default.serveStatic(path_1.default.join(__dirname, "../../../front/dist"), {
                                setHeaders: function (res) {
                                    res.setHeader("X-XSS-Protection", "1; mode=block");
                                },
                            }),
                        ],
                    },
                    {
                        path: "/version",
                        // Disable authentication.
                        authentication: false,
                        /**
                         * Routes
                         * https://moleculer.services/docs/0.14/moleculer-web.html#Aliases
                         */
                        aliases: {
                            "GET /"(req, res, ctx) {
                                const data = {
                                    ok: true,
                                    version: {
                                        back: backPackage.version,
                                        front: frontPackage.version,
                                        api: apiPackage.version,
                                    },
                                };
                                res.setHeader("Content-Type", "application/json; charset=utf-8");
                                return this.sendResponse(req, res, data);
                            },
                        },
                    },
                ], // End routes
            },
        });
    }
}
exports.default = RootRoute;
//# sourceMappingURL=root.route.js.map