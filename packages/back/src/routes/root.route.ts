/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use strict";

import { IncomingMessage } from "connect";
import { ServerResponse } from "http";
import { Context, Service, ServiceBroker } from "moleculer";
import ApiGateway from "moleculer-web";
import path from "path";
import GlobalRoute from "./global.route";

const backPackage = require("../../package.json");
const frontPackage = require("../../../front/package.json");
const apiPackage = require("../../../api/package.json");

/**
 *
 * Expose root route to /version path
 *
 * Authentification is disable for root route
 */
export default class RootRoute extends Service {
  public constructor(broker: ServiceBroker) {
    super(broker);

    this.parseServiceSchema({
      name: "route.root",
      mixins: [new GlobalRoute(broker).originalSchema],

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
              ApiGateway.serveStatic(path.join(__dirname, "../../../front/dist"), {
                setHeaders: function (res: ServerResponse) {
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
              "GET /"(this: Service, req: IncomingMessage, res: ServerResponse, ctx: Context): any {
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
