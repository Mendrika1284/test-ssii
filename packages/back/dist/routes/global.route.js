"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorHandler_1 = require("@/routes/ErrorHandler");
const config_1 = __importDefault(require("config"));
const helmet_1 = __importDefault(require("helmet"));
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const moleculer_1 = __importStar(require("moleculer"));
const jwt_token_1 = require("@/lib/auth/jwt-token");
const error_1 = require("@/lib/error");
var MoleculerError = moleculer_1.default.Errors.MoleculerError;
const ajv_1 = __importDefault(require("ajv"));
const ajv_bsontype_1 = __importDefault(require("ajv-bsontype"));
const lodash_1 = __importDefault(require("lodash"));
const NotFoundError_1 = require("@/lib/error/NotFoundError");
/**
 * Common configuration for all route
 */
class GlobalRoute extends moleculer_1.Service {
    constructor(broker) {
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
                    (0, helmet_1.default)(broker.options.$settings.gateway.helmet),
                    // Redirect to HTTPS
                    function (req, res, next) {
                        var _a, _b;
                        if (broker.options.$settings.gateway.dns.trustProxy && req.headers["x-forwarded-proto"] === "http") {
                            const url = String("https://")
                                .concat((_a = req.headers.host) !== null && _a !== void 0 ? _a : "8080")
                                .concat((_b = req.originalUrl) !== null && _b !== void 0 ? _b : "");
                            res.writeHead(301, { Location: url });
                            res.end();
                        }
                        else {
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
                    logRequestParams: config_1.default.get("moleculer.logLevel"),
                    // Logging the response data. Set to any log level to enable it. E.g. "info"
                    logResponseData: config_1.default.get("moleculer.logLevel"),
                    key: (req) => {
                        const [, accessToken] = (0, jwt_token_1.extractAccessToken)(req);
                        const decoded = jsonwebtoken_1.default.decode(accessToken);
                        if ((decoded === null || decoded === void 0 ? void 0 : decoded.scope) === "support") {
                            return undefined;
                        }
                        else {
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
                        onBeforeCall(ctx, route, req, res) {
                            if (req.url.includes("undefined") || (req.originalUrl && req.originalUrl.includes("undefined"))) {
                                throw new error_1.InternalServerError("Undefined found in params", "API_ERROR", {
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
                            const metaUser = (0, jwt_token_1.retrieveJwt)(req);
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
                        mappingPolicy: "restrict",
                        // Enable/disable logging
                        logging: true,
                        /**
                         * After call hook. We filter data response with AJV, if schema of response exist
                         */
                        onAfterCall(ctx, route, req, res, data) {
                            var _a, _b, _c, _d, _e;
                            if (!res.finished) {
                                res.setHeader("X-XSS-Protection", "1; mode=block");
                            }
                            let responseObject;
                            const activate = false; // TODO Activate in DEV & REC.. or for some controllers...
                            const actionName = (_b = (_a = req.$action) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "unknown";
                            // If data exist we search OpenAPI definition to filter with AJV
                            if (data && ((_d = (_c = req.$action) === null || _c === void 0 ? void 0 : _c.openapi) === null || _d === void 0 ? void 0 : _d.responses)) {
                                responseObject = req.$action.openapi.responses["200"];
                            }
                            if (activate && (responseObject === null || responseObject === void 0 ? void 0 : responseObject.content)) {
                                const schema = (_e = responseObject === null || responseObject === void 0 ? void 0 : responseObject.content["application/json"]) === null || _e === void 0 ? void 0 : _e.schema;
                                this.initAjv();
                                if (schema && this.settings.ajv) {
                                    // Test with date format : doesn't work with Date object => need to have a type:string (interface is in object)
                                    //addFormats(ajv, ["date", "date-time"]); // Add only some format
                                    const validate = this.settings.ajv.compile(schema);
                                    // If you want to transform Date in String to check format with addFormats(ajv, ["date", "date-time"]);
                                    // const updatedSubscriptionJson = JSON.parse(JSON.stringify(updatedSubscription)) as Subscription;
                                    validate(data);
                                    if (validate === null || validate === void 0 ? void 0 : validate.errors) {
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
                        onError(req, res, err) {
                            const url = req.method + " " + req.url;
                            if (url) {
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                err.data = Object.assign({ url }, err.data);
                            }
                            // TODO Set APM in sendErrorMessage to capture all error and not in error hook / and also complete error in sendErrorMessage (with req in parameter)
                            (0, ErrorHandler_1.sendErrorMessage)(this, err, res);
                        },
                    },
                ],
                // Global error handler
                onError(req, res, err) {
                    (0, ErrorHandler_1.sendErrorMessage)(this, err, res);
                },
            },
            methods: {
                authenticate: (ctx, route, req) => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    const routeName = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.span) === null || _a === void 0 ? void 0 : _a.name;
                    try {
                        // Retrieve access Token
                        const [type, accessToken] = (0, jwt_token_1.extractAccessToken)(req);
                        if (!Object.keys(jwt_token_1.JwtType).includes(type)) {
                            // Not Bearer, neither Cookie => You are in a private route !
                            throw new jsonwebtoken_1.JsonWebTokenError("Access Token Type is not supported");
                        }
                        // JWT validation
                        const metaUser = (0, jwt_token_1.verifyJwt)(accessToken);
                        // Renew Token with current date + delay
                        const newAccessToken = (0, jwt_token_1.renewJwt)(metaUser);
                        ctx.meta.$responseHeaders = (0, jwt_token_1.getJwtHeaders)(type, newAccessToken);
                        ctx.meta.user = metaUser;
                        // Extend User with data needed for verify Permission
                        if (metaUser) {
                            const user = yield ctx.call("service.users.get", { email: metaUser.username });
                            if (!user) {
                                throw new NotFoundError_1.NotFoundError("Cannot find user", { email: metaUser.username });
                            }
                            ctx.meta.user.extended = user;
                        }
                        return ctx.meta.user;
                    }
                    catch (err) {
                        const error = err;
                        // Wrong JWT Token or expiration of TTS
                        return Promise.reject(new error_1.UnauthorizedError("Unauthorized", {
                            error: (_b = error.type) !== null && _b !== void 0 ? _b : "Unauthorized",
                            stack: error.stack,
                            route: routeName,
                        }));
                    }
                }),
                /**
                 * Initialize AJV
                 */
                initAjv() {
                    var _a;
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
                            var _a;
                            // Check if openapi exist in settings of service
                            if ((_a = service.settings) === null || _a === void 0 ? void 0 : _a.openapi) {
                                lodash_1.default.merge(res, service.settings.openapi);
                            }
                        });
                        const componentSchema = (_a = res.components) === null || _a === void 0 ? void 0 : _a.schemas;
                        if (componentSchema) {
                            const schemaArray = Object.keys(componentSchema).map((e) => {
                                const ret = componentSchema[e];
                                // Complete with $id for AJV to retrieve $href
                                ret["$id"] = "#/components/schemas/" + e;
                                return ret;
                            });
                            console.log(schemaArray);
                            this.settings.ajv = new ajv_1.default({
                                removeAdditional: true,
                                useDefaults: true,
                                coerceTypes: true,
                                allErrors: true,
                                // formats: { date: true, "date-time": true, "custom-date-time": true },
                            });
                            this.settings.ajv.addSchema(schemaArray);
                            (0, ajv_bsontype_1.default)(this.settings.ajv);
                        }
                    }
                    catch (err) {
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
            onError(req, res, err) {
                (0, ErrorHandler_1.sendErrorMessage)(this, err, res);
            },
        });
    }
}
exports.default = GlobalRoute;
//# sourceMappingURL=global.route.js.map