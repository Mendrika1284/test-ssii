"use strict";

import { sendErrorMessage } from "@/routes/ErrorHandler";
import { MetaUser, User } from "@edmp/api";
import config from "config";
import { IncomingMessage } from "connect";
import helmet from "helmet";
import { IncomingHttpHeaders, ServerResponse } from "http";
import jsonWebToken, { JsonWebTokenError } from "jsonwebtoken";
import Moleculer, { Context, GenericObject, Service, ServiceBroker, ServiceSchema } from "moleculer";
import { extractAccessToken, getJwtHeaders, JwtType, renewJwt, retrieveJwt, verifyJwt } from "@/lib/auth/jwt-token";
import { InternalServerError, UnauthorizedError } from "@/lib/error";
import MoleculerError = Moleculer.Errors.MoleculerError;
import { OpenAPIV3 } from "openapi-types";
import Ajv, { JSONSchemaType } from "ajv";
import ajvbsontype from "ajv-bsontype";
import _ from "lodash";
import { NotFoundError } from "@/lib/error/NotFoundError";

interface GlobalRouteMethods {
  initAjv(): void;
}
interface GlobalRouteSettings {
  ajv?: Ajv;
}
type GlobalRouteSchema = ServiceSchema & {
  methods: GlobalRouteMethods;
  settings: GlobalRouteSettings;
};

interface GlobalRouteService extends Service, GlobalRouteMethods {
  settings: GlobalRouteSettings;
}

/**
 * Common configuration for all route
 */
export default class GlobalRoute extends Service {
  public constructor(broker: ServiceBroker) {
    super(broker);

    this.parseServiceSchema({
      name: "route.global",

      // More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
      settings: {
        // Routing
        path: "/",

        ajv: undefined,

        // Global middlewares. Applied to all routes.
        use: [
          helmet(broker.options.$settings.gateway.helmet),
          // Redirect to HTTPS
          function (req: IncomingMessage, res: ServerResponse, next: () => unknown): unknown {
            if (broker.options.$settings.gateway.dns.trustProxy && req.headers["x-forwarded-proto"] === "http") {
              const url = String("https://")
                .concat(req.headers.host ?? "8080")
                .concat(req.originalUrl ?? "");

              res.writeHead(301, { Location: url });
              res.end();
            } else {
              return next();
            }
          },
        ],

        /**
         * Global CORS settings for all routes
         * https://moleculer.services/docs/0.14/moleculer-web.html#CORS-headers
         */
        cors: {
          // Configures the Access-Control-Allow-Origin CORS header.
          origin: ["*"],
          // Configures the Access-Control-Allow-Methods CORS header.
          methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
          // Configures the Access-Control-Allow-Headers CORS header.
          allowedHeaders: "*",
          // Configures the Access-Control-Expose-Headers CORS header.
          exposedHeaders: [],
          // Configures the Access-Control-Allow-Credentials CORS header.
          credentials: true,
          // Configures the Access-Control-Max-Age CORS header.
          maxAge: 3600,
        },

        /**
         * Rate limiter
         * https://moleculer.services/docs/0.14/moleculer-web.html#Rate-limiter
         */
        rateLimit: {
          // How long to keep record of requests in memory (in milliseconds).
          // Defaults to 60000 (1 min)
          window: 60 * 1000,

          // Max number of requests during window.
          // Configured for all routes
          // - We need another Router to modify this value (ie:Meta)
          // - If we want another rateLimit for site Mini we need another router -> another PATH...
          limit: broker.options.$settings.gateway.rateLimit.limit,

          // Set rate limit headers to response. Defaults to false
          headers: true,

          // https://moleculer.services/docs/0.14/moleculer-web.html#ETag
          etag: true,

          // Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
          log4XXResponses: false,
          // Logging the request parameters. Set to any log level to enable it. E.g. "info"
          logRequestParams: config.get("moleculer.logLevel"),
          // Logging the response data. Set to any log level to enable it. E.g. "info"
          logResponseData: config.get("moleculer.logLevel"),

          key: (req: IncomingMessage) => {
            const [, accessToken] = extractAccessToken(req);

            const decoded = jsonWebToken.decode(accessToken) as MetaUser | null;

            if (decoded?.scope === "support") {
              return undefined;
            } else {
              return req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress;
            }
          },
          // to debug we can clone https://github.com/moleculerjs/moleculer-web/blob/master/src/memory-store.js
          // StoreFactory: CustomStore,
        },

        routes: [
          {
            // path: "/",

            // Before call hook. You can check the request.
            onBeforeCall(
              ctx: Context<unknown, { rep: ServerResponse; reqHeaders: IncomingHttpHeaders; user: MetaUser }>,
              route: Record<string, unknown>,
              req: IncomingMessage & { method: string; url: string; body: GenericObject },
              res: ServerResponse
            ) {
              if (req.url.includes("undefined") || (req.originalUrl && req.originalUrl.includes("undefined"))) {
                throw new InternalServerError("Undefined found in params", "API_ERROR", {
                  url: req.url,
                  originalUrl: req.originalUrl,
                  body: req.body,
                });
              }

              ctx.meta.rep = res;
              ctx.meta.reqHeaders = req.headers;

              // We init meta.user to Anonymous before authentication of private route (or not if public route)
              ctx.meta.user = {
                id: "anonymous",
                username: "anonymous",
                scope: "anonymous",
              };

              // We try to retrieve User for sub (log) if User is connected (JWT valid)
              const metaUser = retrieveJwt(req);

              if (metaUser) {
                ctx.meta.user = metaUser;
              }
            },

            // Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
            mergeParams: true,

            // Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
            authentication: true,

            // Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
            authorization: false,

            // The auto-alias feature allows you to declare your route alias directly in your services.
            // The gateway will dynamically build the full routes from service schema.
            autoAliases: false,

            // Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
            callingOptions: {},

            bodyParsers: {
              json: {
                strict: false,
                limit: "1MB",
              },
              urlencoded: {
                extended: true,
                limit: "1MB",
              },
            },

            // Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
            mappingPolicy: "restrict", // Available values: "all", "restrict"

            // Enable/disable logging
            logging: true,

            /**
             * After call hook. We filter data response with AJV, if schema of response exist
             */
            onAfterCall(
              this: GlobalRouteService,
              ctx: Context,
              route: Record<string, unknown>,
              req: IncomingMessage & { $action?: { name: string; openapi?: OpenAPIV3.OperationObject } },
              res: ServerResponse,
              data: Record<string, string>
            ) {
              if (!res.finished) {
                res.setHeader("X-XSS-Protection", "1; mode=block");
              }
              let responseObject;
              const activate = false; // TODO Activate in DEV & REC.. or for some controllers...
              const actionName = req.$action?.name ?? "unknown";

              // If data exist we search OpenAPI definition to filter with AJV
              if (data && req.$action?.openapi?.responses) {
                responseObject = req.$action.openapi.responses["200"] as OpenAPIV3.ResponseObject;
              }

              if (activate && responseObject?.content) {
                const schema = responseObject?.content["application/json"]?.schema;

                this.initAjv();
                if (schema && this.settings.ajv) {
                  // Test with date format : doesn't work with Date object => need to have a type:string (interface is in object)
                  //addFormats(ajv, ["date", "date-time"]); // Add only some format

                  const validate = this.settings.ajv.compile(schema);
                  // If you want to transform Date in String to check format with addFormats(ajv, ["date", "date-time"]);
                  // const updatedSubscriptionJson = JSON.parse(JSON.stringify(updatedSubscription)) as Subscription;

                  validate(data);
                  if (validate?.errors) {
                    const message = this.settings.ajv.errorsText(validate.errors);
                    this.logger.error({ ajv: { actionName: actionName, message } }, `Failed to validate`);
                  }
                }
              }

              return data;
            },

            /**
             * Route error handler
             * https://moleculer.services/docs/0.14/moleculer-web.html#Error-handlers
             */
            onError(
              this: Service,
              req: IncomingMessage & { method: string; url: string },
              res: ServerResponse,
              err: MoleculerError
            ) {
              const url = req.method + " " + req.url;
              if (url) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                err.data = Object.assign({ url }, err.data);
              }
              // TODO Set APM in sendErrorMessage to capture all error and not in error hook / and also complete error in sendErrorMessage (with req in parameter)
              sendErrorMessage(this, err, res);
            },
          },
        ], // End routes

        // Global error handler
        onError(this: Service, req: IncomingMessage, res: ServerResponse, err: MoleculerError) {
          sendErrorMessage(this, err, res);
        },
      },

      methods: {
        authenticate: async (
          ctx: Context<
            Record<string, unknown>,
            {
              user: MetaUser;
              $responseType?: string;
              $responseHeaders?: { "Set-Cookie"?: string; authorization?: string };
            }
          >,
          route: Record<string, unknown>,
          req: IncomingMessage & { $params?: { userId: string }; body: Record<string, unknown> }
        ) => {
          const routeName = ctx?.span?.name;

          try {
            // Retrieve access Token
            const [type, accessToken] = extractAccessToken(req);

            if (!Object.keys(JwtType).includes(type)) {
              // Not Bearer, neither Cookie => You are in a private route !
              throw new JsonWebTokenError("Access Token Type is not supported");
            }
            // JWT validation
            const metaUser = verifyJwt(accessToken);

            // Renew Token with current date + delay
            const newAccessToken = renewJwt(metaUser);
            ctx.meta.$responseHeaders = getJwtHeaders(type, newAccessToken);

            ctx.meta.user = metaUser;

            // Extend User with data needed for verify Permission
            if (metaUser) {
              const user: User | undefined = await ctx.call("service.users.get", { email: metaUser.username });
              if (!user) {
                throw new NotFoundError("Cannot find user", { email: metaUser.username });
              }
              ctx.meta.user.extended = user;
            }

            return ctx.meta.user;
          } catch (err) {
            const error = err as MoleculerError;
            // Wrong JWT Token or expiration of TTS
            return Promise.reject(
              new UnauthorizedError("Unauthorized", {
                error: error.type ?? "Unauthorized",
                stack: error.stack,
                route: routeName,
              })
            );
          }
        },

        /**
         * Initialize AJV
         */
        initAjv(this: GlobalRouteService) {
          if (this.settings.ajv) {
            // Already initialize
            return;
          }
          // Initialize "AJV
          try {
            const res = {};

            /**
             * Get broker controllers
             */
            const services = this.broker.registry.getServiceList({
              onlyAvailable: true,
              withActions: true,
            });

            // Retrieve all schemas to merge in all Controllers
            services.forEach((service) => {
              // Check if openapi exist in settings of service
              if (service.settings?.openapi) {
                _.merge(res, service.settings.openapi);
              }
            });

            const componentSchema = (res as OpenAPIV3.Document).components?.schemas;
            if (componentSchema) {
              const schemaArray = Object.keys(componentSchema).map((e) => {
                const ret = componentSchema[e] as JSONSchemaType<typeof e>;
                // Complete with $id for AJV to retrieve $href
                ret["$id"] = "#/components/schemas/" + e;

                return ret;
              });
              console.log(schemaArray);

              this.settings.ajv = new Ajv({
                removeAdditional: true,
                useDefaults: true,
                coerceTypes: true,
                allErrors: true,
                // formats: { date: true, "date-time": true, "custom-date-time": true },
              });
              this.settings.ajv.addSchema(schemaArray);
              ajvbsontype(this.settings.ajv);
            }
          } catch (err) {
            throw new MoleculerError("Unable to  set AJV with OpenAPI schema ", 500, "UNABLE_TO_ACTIVATE_AJV", {
              err,
            });
          }
        },
      },

      /**
       * Global error handler
       * https://moleculer.services/docs/0.14/moleculer-web.html#Error-handlers
       */
      onError(this: Service, req: IncomingMessage, res: ServerResponse, err: MoleculerError) {
        sendErrorMessage(this, err, res);
      },
    } as GlobalRouteSchema);
  }
}
