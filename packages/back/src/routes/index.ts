import { OpenapiMixinFactory } from "@/mixins";
import Moleculer, { Context, Service, ServiceBroker, ServiceSchema } from "moleculer";
import ApiGateway from "moleculer-web";
import merge from "webpack-merge";
import ApiRoute from "./api.route";
import GlobalRoute from "./global.route";
import MetaRoute from "./meta.route";
import RootRoute from "./root.route";
import MoleculerError = Moleculer.Errors.MoleculerError;
import { InternalServerError, UnavailableError, ConflictError } from "@/lib/error";

function defaultRouteConfig(global: ServiceSchema, route: ServiceSchema) {
  const mergedRoutesSetting = [];
  // List of route to merge with Global Route
  const currentRoutesSetting = (route?.settings?.routes as Array<Record<string, unknown>>) ?? [];
  const globalRouteSetting = (global?.settings?.routes as Array<Record<string, unknown>>) ?? [];

  for (let index = 0; index < currentRoutesSetting.length; index++) {
    const currentRouteSetting = currentRoutesSetting[index];
    // Merge settings of global route with settings of current route
    mergedRoutesSetting.push(merge(globalRouteSetting[0], currentRouteSetting));
  }
  // PATCH routes
  if (route?.settings) {
    route.settings.routes = mergedRoutesSetting;
  }

  return route;
}

/**
 * Merge routes setting with global route settings because MOLECULER merge only first route in MIXIN
 * @param broker
 */
export default function (broker: ServiceBroker): ServiceSchema {
  const port = broker.options.$settings.gateway.port ?? 8080;

  const globalRoute = new GlobalRoute(broker).originalSchema;
  const metaRoute = defaultRouteConfig(globalRoute, new MetaRoute(broker).originalSchema);
  const apiRoute = defaultRouteConfig(globalRoute, new ApiRoute(broker).originalSchema);
  const rootRoute = defaultRouteConfig(globalRoute, new RootRoute(broker).originalSchema);

  return merge(rootRoute, metaRoute, apiRoute, {
    name: "routes",
    mixins: [ApiGateway, OpenapiMixinFactory("/doc")],

    settings: {
      server: true,
      port: port,
    },
    hooks: {
      error: {
        "*": function (
          this: Service,
          ctx: Context & {
            params: {
              req: { method: string; url: string; body: Record<string, unknown>; headers: Record<string, unknown> };
            };
          },
          err: Error
        ) {
          // Capture information about request
          const actionName = ctx.action?.name ?? "unknown";
          const routeName = ctx?.span?.name ?? ctx?.params?.req?.url;
          const requestBody = ctx?.params?.req.body;
          const requestId = ctx.requestID ?? ctx?.params?.req.headers["x-request-id"];
          const url = ctx?.params?.req?.method + " " + ctx?.params?.req?.url;
          const data = { url, route: routeName, requestId, requestBody, stack: err.stack };
          const error = err as MoleculerError;
          const errorCode = error.code;
          const errorType = error.type;

          // Translate various errors in 50x or 40x
          // /!\ Message will be logged and format in onError
          switch (true) {
            case "number" !== typeof errorCode:
              throw new InternalServerError(err.message, errorType, data);
            case errorCode === 11000: // MongoDB duplicate key
              this.logger.error({ err }, `Duplicate Key error when ${actionName} action was called`);
              throw new ConflictError("Duplicate key", errorType, data);
            // Note: MongoDB error codes are not really well documented, see
            // https://jira.mongodb.org/browse/DOCS-10757
            case errorCode && errorCode > 699: // Presumably Mongo or other
              throw new InternalServerError(err.message, errorType, data);
            case "SERVICE_NOT_FOUND" === errorType:
              throw new UnavailableError(err.message, errorType, data);
            case error.name === "MongoError":
              // Mongoose error code is not a valid Http Status error code (60 for example)
              // We send a 500 with InternalServerError
              this.logger.error({ err }, `MongoError when ${actionName} action was called`);
              throw new InternalServerError(err.message, errorType, { ...data, errorCode });
            default:
              // Complete data
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              error.data = { ...data, ...error.data };
              throw error;
          }
        },
      },
    },
  });
}
