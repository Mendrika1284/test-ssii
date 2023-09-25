"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mixins_1 = require("@/mixins");
const moleculer_web_1 = __importDefault(require("moleculer-web"));
const webpack_merge_1 = __importDefault(require("webpack-merge"));
const api_route_1 = __importDefault(require("./api.route"));
const global_route_1 = __importDefault(require("./global.route"));
const meta_route_1 = __importDefault(require("./meta.route"));
const root_route_1 = __importDefault(require("./root.route"));
const error_1 = require("@/lib/error");
function defaultRouteConfig(global, route) {
    var _a, _b, _c, _d;
    const mergedRoutesSetting = [];
    // List of route to merge with Global Route
    const currentRoutesSetting = (_b = (_a = route === null || route === void 0 ? void 0 : route.settings) === null || _a === void 0 ? void 0 : _a.routes) !== null && _b !== void 0 ? _b : [];
    const globalRouteSetting = (_d = (_c = global === null || global === void 0 ? void 0 : global.settings) === null || _c === void 0 ? void 0 : _c.routes) !== null && _d !== void 0 ? _d : [];
    for (let index = 0; index < currentRoutesSetting.length; index++) {
        const currentRouteSetting = currentRoutesSetting[index];
        // Merge settings of global route with settings of current route
        mergedRoutesSetting.push((0, webpack_merge_1.default)(globalRouteSetting[0], currentRouteSetting));
    }
    // PATCH routes
    if (route === null || route === void 0 ? void 0 : route.settings) {
        route.settings.routes = mergedRoutesSetting;
    }
    return route;
}
/**
 * Merge routes setting with global route settings because MOLECULER merge only first route in MIXIN
 * @param broker
 */
function default_1(broker) {
    var _a;
    const port = (_a = broker.options.$settings.gateway.port) !== null && _a !== void 0 ? _a : 8080;
    const globalRoute = new global_route_1.default(broker).originalSchema;
    const metaRoute = defaultRouteConfig(globalRoute, new meta_route_1.default(broker).originalSchema);
    const apiRoute = defaultRouteConfig(globalRoute, new api_route_1.default(broker).originalSchema);
    const rootRoute = defaultRouteConfig(globalRoute, new root_route_1.default(broker).originalSchema);
    return (0, webpack_merge_1.default)(rootRoute, metaRoute, apiRoute, {
        name: "routes",
        mixins: [moleculer_web_1.default, (0, mixins_1.OpenapiMixinFactory)("/doc")],
        settings: {
            server: true,
            port: port,
        },
        hooks: {
            error: {
                "*": function (ctx, err) {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
                    // Capture information about request
                    const actionName = (_b = (_a = ctx.action) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "unknown";
                    const routeName = (_d = (_c = ctx === null || ctx === void 0 ? void 0 : ctx.span) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : (_f = (_e = ctx === null || ctx === void 0 ? void 0 : ctx.params) === null || _e === void 0 ? void 0 : _e.req) === null || _f === void 0 ? void 0 : _f.url;
                    const requestBody = (_g = ctx === null || ctx === void 0 ? void 0 : ctx.params) === null || _g === void 0 ? void 0 : _g.req.body;
                    const requestId = (_h = ctx.requestID) !== null && _h !== void 0 ? _h : (_j = ctx === null || ctx === void 0 ? void 0 : ctx.params) === null || _j === void 0 ? void 0 : _j.req.headers["x-request-id"];
                    const url = ((_l = (_k = ctx === null || ctx === void 0 ? void 0 : ctx.params) === null || _k === void 0 ? void 0 : _k.req) === null || _l === void 0 ? void 0 : _l.method) + " " + ((_o = (_m = ctx === null || ctx === void 0 ? void 0 : ctx.params) === null || _m === void 0 ? void 0 : _m.req) === null || _o === void 0 ? void 0 : _o.url);
                    const data = { url, route: routeName, requestId, requestBody, stack: err.stack };
                    const error = err;
                    const errorCode = error.code;
                    const errorType = error.type;
                    // Translate various errors in 50x or 40x
                    // /!\ Message will be logged and format in onError
                    switch (true) {
                        case "number" !== typeof errorCode:
                            throw new error_1.InternalServerError(err.message, errorType, data);
                        case errorCode === 11000: // MongoDB duplicate key
                            this.logger.error({ err }, `Duplicate Key error when ${actionName} action was called`);
                            throw new error_1.ConflictError("Duplicate key", errorType, data);
                        // Note: MongoDB error codes are not really well documented, see
                        // https://jira.mongodb.org/browse/DOCS-10757
                        case errorCode && errorCode > 699: // Presumably Mongo or other
                            throw new error_1.InternalServerError(err.message, errorType, data);
                        case "SERVICE_NOT_FOUND" === errorType:
                            throw new error_1.UnavailableError(err.message, errorType, data);
                        case error.name === "MongoError":
                            // Mongoose error code is not a valid Http Status error code (60 for example)
                            // We send a 500 with InternalServerError
                            this.logger.error({ err }, `MongoError when ${actionName} action was called`);
                            throw new error_1.InternalServerError(err.message, errorType, Object.assign(Object.assign({}, data), { errorCode }));
                        default:
                            // Complete data
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                            error.data = Object.assign(Object.assign({}, data), error.data);
                            throw error;
                    }
                },
            },
        },
    });
}
exports.default = default_1;
//# sourceMappingURL=index.js.map