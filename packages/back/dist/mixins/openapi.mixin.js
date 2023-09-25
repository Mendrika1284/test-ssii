"use strict";
/**
 * Src doc
 * https://github.com/icebob/kantab/blob/master/backend/mixins/openapi.mixin.js
 * https://github.com/swagger-api/swagger-ui/issues/2915
 * https://www.npmjs.com/package/swagger-ui-express
 */
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
exports.OpenapiMixinFactory = void 0;
const lodash_1 = __importDefault(require("lodash"));
const config_1 = __importDefault(require("config"));
const moleculer_web_1 = __importDefault(require("moleculer-web"));
const moleculer_1 = require("moleculer");
const swagger_ui_dist_1 = __importDefault(require("swagger-ui-dist"));
const webpack_merge_1 = require("webpack-merge");
const jwt_token_1 = require("@/lib/auth/jwt-token");
const error_1 = require("@/lib/error");
const { MoleculerServerError } = moleculer_1.Errors;
const pkg = require("../../package.json");
const OpenapiMixinFactory = function (routeRoot, mixinOptions) {
    // Moleculer-web error reporter
    const onError = function (req, res, err) {
        var _a;
        res.setHeader("Content-Type", "application/json");
        res.writeHead((_a = err.code) !== null && _a !== void 0 ? _a : 500);
        res.end(JSON.stringify({
            message: err.message,
            data: err.data,
        }));
    };
    /**
     * Define external url
     */
    const { SUB_DOMAIN } = process.env;
    const envUrl = {
        dev: "http://localhost:8080",
        review: `https://${SUB_DOMAIN}.review.app.ownily.fr`,
        staging: "https://ownily-sta.cleverapps.io",
        production: "https://app.ownily.fr",
    };
    let externalUrl = "";
    switch (config_1.default.util.getEnv("NODE_CONFIG_ENV")) {
        case "dev":
            externalUrl = envUrl.dev;
            break;
    }
    /**
     * Define mixin options
     */
    mixinOptions = lodash_1.default.defaultsDeep(mixinOptions, {
        routeOptions: {
            path: routeRoot,
            // Route CORS settings (overwrite global settings)
            cors: {
                // Configures the Access-Control-Allow-Origin CORS header.
                origin: "*",
                // Configures the Access-Control-Allow-Methods CORS header.
                methods: ["GET", "POST"],
            },
            // Before call hook. You can check the request.
            // eslint-disable-next-line no-unused-vars
            onBeforeCall(ctx, route, req) {
                /**
                 * This method allow to retrieve Type and AccessToken from request headers.
                 * We manage both Cookie and Authorization header with JWT Bearer.
                 * @param req API request
                 * @return [type, accessToken] type is Bearer or cookie, accessToken is a JWT token
                 */
                if (req.url.includes("undefined") || (req.originalUrl && req.originalUrl.includes("undefined"))) {
                    throw new error_1.InternalServerError("Undefined found in params", "API_ERROR", {
                        url: req.url,
                        originalUrl: req.originalUrl,
                        body: req.body,
                    });
                }
                try {
                    // Retrieve access Token
                    const [type, accessToken] = (0, jwt_token_1.extractAccessToken)(req);
                    if (!Object.keys(jwt_token_1.JwtType).includes(type)) {
                        ctx.meta.user = { scope: "anonymous" };
                        return ctx.meta.user;
                    }
                    // JWT validation
                    const decoded = (0, jwt_token_1.verifyJwt)(accessToken);
                    // Renew Token with current date + delay
                    const newAccessToken = (0, jwt_token_1.renewJwt)(decoded);
                    ctx.meta.$responseHeaders = (0, jwt_token_1.getJwtHeaders)(type, newAccessToken);
                    // Set user in meta
                    return (ctx.meta.user = Object.assign(decoded, { token: newAccessToken }));
                }
                catch (err) {
                    ctx.meta.user = { scope: "anonymous" };
                    return ctx.meta.user;
                }
            },
            // Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
            mergeParams: true,
            // Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
            authentication: false,
            // Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
            authorization: false,
            // The auto-alias feature allows you to declare your route alias directly in your services.
            // The gateway will dynamically build the full routes from service schema.
            autoAliases: false,
            // Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
            callingOptions: {},
            // Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
            mappingPolicy: "restrict",
            // Enable/disable logging
            logging: true,
            /**
             * Route error handler
             * https://moleculer.services/docs/0.14/moleculer-web.html#Error-handlers
             */
            onError,
        },
        schema: null,
    });
    // let shouldUpdateSchema = true;
    let schema = null;
    return {
        // events: {
        // 	"$services.changed"(ctx) { this.invalidateOpenapiSchema(); },
        // },
        settings: {
            routes: [],
            /**
             * Definition of links between routes and services
             */
            apiRoutesControllers: {
                api: {
                    controllers: ["controller.user-accounts", "controller.users", "controller.example"],
                    tags: [
                        { name: "UserAccount", description: "User account operations" },
                        { name: "Users", description: "User operations" },
                        { name: "Example", description: "Example operations" },
                    ],
                },
                meta: {
                    controllers: ["controller.user-accounts"],
                    tags: [{ name: "Meta", description: "Identity provider" }],
                },
            },
            /**
             * Definition of roles - defined in service controller action "openapi"
             * role: ["member", "support", "admin"]
             *
             * Available roles :
             * - "anonymous"
             * - "member"
             * - "support"
             * - "admin"
             * - "system"
             */
            /**
             * https://swagger.io/specification/#securityRequirementObject
             * Add this to openapi @Action controller for secure route
             * security: [
             *  { bearerAuth: [] },
             *  { cookieAuth: [] }
             * ],
             */
            /**
             * Define swagger default settings
             */
            swaggerOptions: {
                urls: [
                    {
                        url: `${externalUrl}/doc/api.json`,
                        name: "Job Resource (/api)",
                    },
                    {
                        url: `${externalUrl}/doc/meta.json`,
                        name: "Auth Resource (/meta)",
                    },
                    {
                        url: `${externalUrl}/doc/root.json`,
                        name: "Système Resource (/root)",
                    },
                ],
                layout: "StandaloneLayout",
                deepLinking: true,
                supportHeaderParams: true,
                supportedSubmitMethods: ["get", "put", "post", "delete", "options", "head", "patch", "trace"],
            },
            /**
             * Define swagger template html
             */
            swaggerHtmlTpl: `
      <!-- HTML for static distribution bundle build -->
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Swagger UI</title>
          <link rel="stylesheet" type="text/css" href="./swagger-ui.css" >
          <link rel="icon" type="image/png" href="./favicon-32x32.png" sizes="32x32" />
          <link rel="icon" type="image/png" href="./favicon-16x16.png" sizes="16x16" />
          <style>
            html
            {
              box-sizing: border-box;
              overflow: -moz-scrollbars-vertical;
              overflow-y: scroll;
            }

            *,
            *:before,
            *:after
            {
              box-sizing: inherit;
            }

            body
            {
              margin:0;
              background: #fafafa;
            }
          </style>
        </head>

        <body>
          <div id="swagger-ui"></div>

          <script src="./swagger-ui-bundle.js" charset="UTF-8"> </script>
          <script src="./swagger-ui-standalone-preset.js" charset="UTF-8"> </script>
					<script>
					let schematUrl = "";

          window.onload = function() {
            // Begin Swagger UI call region
            const swaggerDef = {
							dom_id: '#swagger-ui',

              presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIStandalonePreset
							],

              plugins: [
                SwaggerUIBundle.plugins.DownloadUrl
							],

              requestInterceptor: function (request) {
								// console.log('[Swagger] intercept try-it-out request', request);
                return request;
							},

              responseInterceptor: function (response) {
								// console.log('[Swagger] intercept try-it-out response', response);
								var match = new RegExp("^https?://[^/]+/meta/v1/login(?:/?|/?#.*)$");
								if (match.test(response.url)) {
										document.location.reload();
								}
                return response;
							},

              onComplete: function() {
								var preAuthorizeApiKey = <% preauthorizeApiKey %>
                switch (preAuthorizeApiKey.token_type) {
                  case 'Cookie':
                    ui.preauthorizeApiKey("cookieAuth", preAuthorizeApiKey.id_token);
                    break;
                  default:
                    // console.log('No token get');
								}
							},

              onFailure: function(data) {
                if(console) {
                  console.log("Unable to Load SwaggerUI");
                  console.log(data);
                }
              },
						}

            var swaggerOptions = <% swaggerOptions %>
  
            const swaggerConf = Object.assign(swaggerDef, swaggerOptions);

            const ui = SwaggerUIBundle(swaggerConf)
            // End Swagger UI call region

            window.ui = ui
          }
        </script>
        </body>
      </html>
      `,
        },
        actions: {
            getOpenapiSchema: {
                handler: function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        const metaSchema = this.generateOpenapiSchema(envUrl, this.settings.apiRoutesControllers, "meta", "support");
                        const apiSchema = this.generateOpenapiSchema(envUrl, this.settings.apiRoutesControllers, "api", "support");
                        return (0, webpack_merge_1.merge)(metaSchema, apiSchema);
                    });
                },
            },
        },
        methods: {
            /**
             * Invalidate the generated Swagger schema
             * Désactivé pour l'instant, on regénère le schéma à chaque que l'on appelle GET *.json
             */
            // invalidateOpenapiSchema() {
            // 	shouldUpdateSchema = true;
            // },
            /**
             * Get token from headers
             */
            accessToken(token) {
                if (token) {
                    token = { token_type: "Cookie", id_token: token };
                }
                else {
                    token = { token_type: "none" };
                }
                return token;
            },
            /**
             * Configuration Swagger
             */
            swaggerGenerateHTML(jsTplString, opts, externalUrl, accessToken) {
                return jsTplString
                    .toString()
                    .replace("<% swaggerOptions %>", JSON.stringify(opts))
                    .replace("<% externalUrl %>", externalUrl)
                    .replace("<% preauthorizeApiKey %>", JSON.stringify(accessToken));
            },
            /**
             * Generate OpenAPI Schema
             */
            generateOpenapiSchema(envUrl, apiRoutesControllersFilter, route, role) {
                try {
                    const res = lodash_1.default.defaultsDeep(mixinOptions.schema, {
                        openapi: "3.0.1",
                        // https://swagger.io/specification/#infoObject
                        info: {
                            title: "Ownily API Documentation",
                            description: "`Login on ownily or get token below for access to all routes`",
                            version: pkg.version,
                        },
                        // https://swagger.io/specification/#serverObject
                        servers: [
                            { description: "Dev", url: envUrl.dev },
                            { description: "Review", url: envUrl.review },
                            { description: "Staging", url: envUrl.staging },
                            { description: "Production", url: envUrl.production },
                        ],
                        // https://swagger.io/specification/#componentsObject
                        components: {
                            securitySchemes: {
                                bearerAuth: {
                                    // arbitrary name for the security scheme
                                    description: "Enter JWT token **_only_**",
                                    type: "http",
                                    scheme: "bearer",
                                    bearerFormat: "JWT", // optional, arbitrary value for documentation purposes
                                },
                                cookieAuth: {
                                    // arbitrary name for the security scheme; will be used in the "security" key later
                                    description: "Enter JWT token **_only_**",
                                    type: "apiKey",
                                    in: "cookie",
                                    name: "edmp", // cookie name
                                },
                            },
                            schemas: {
                                Credentials: {
                                    type: "object",
                                    properties: {
                                        username: {
                                            type: "string",
                                            example: "john.doe@exemple.com",
                                        },
                                    },
                                },
                            },
                        },
                        // https://swagger.io/specification/#pathsObject
                        paths: {
                            "/meta/v1/login": {
                                post: {
                                    tags: ["Token"],
                                    operationId: "postCredentialsItem",
                                    summary: "Get access JWT token.",
                                    requestBody: {
                                        description: "Create new JWT Token",
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    $ref: "#/components/schemas/Credentials",
                                                },
                                            },
                                        },
                                    },
                                    responses: {
                                        200: {
                                            description: "Get JWT token <br/> **_This automatically configures authorize_**",
                                        },
                                    },
                                },
                            },
                        },
                        // https://swagger.io/specification/#tagObject
                        tags: [
                            {
                                name: "Token",
                                description: "Get authorize JWT token for 'Try it out'",
                            },
                        ],
                        // https://swagger.io/specification/#externalDocumentationObject
                        // externalDocs: [],
                    });
                    /**
                     * Get broker controllers, filter service by route (apiRoutesControllersFilter) and add openapi route shema
                     */
                    const services = this.broker.registry.getServiceList({
                        onlyAvailable: true,
                        withActions: true,
                    });
                    const existTag = [];
                    services.forEach((service) => {
                        apiRoutesControllersFilter[route].controllers.forEach((controllerFilter) => {
                            var _a;
                            // Filter service by route endpoint service
                            if (service.name == controllerFilter) {
                                // --- COMPILE SERVICE-LEVEL DEFINITIONS ---
                                if ((_a = service.settings) === null || _a === void 0 ? void 0 : _a.openapi) {
                                    lodash_1.default.merge(res, service.settings.openapi);
                                }
                                // --- COMPILE ACTION-LEVEL DEFINITIONS ---
                                lodash_1.default.forIn(service.actions, (action) => {
                                    if (lodash_1.default.isObject(action.openapi)) {
                                        action.openapi.role.forEach((roleFilter) => {
                                            // Filter action role by user role
                                            if (roleFilter == role) {
                                                const def = lodash_1.default.cloneDeep(action.openapi);
                                                let method, routePath;
                                                if (def.$path) {
                                                    const p = def.$path.split(" ");
                                                    method = p[0].toLowerCase();
                                                    routePath = p[1];
                                                    delete def.$path;
                                                }
                                                lodash_1.default.set(res.paths, [routePath, method], def);
                                                action.openapi.tags.forEach((actionTags) => {
                                                    apiRoutesControllersFilter[route].tags.forEach((tagFilter) => {
                                                        // Filter action tag by route endpoint tag and if tag d'ont exist
                                                        if (actionTags == tagFilter.name && existTag.includes(tagFilter.name) == false) {
                                                            existTag.push(tagFilter.name);
                                                            res.tags.push(tagFilter);
                                                        }
                                                    });
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });
                    return res;
                }
                catch (err) {
                    throw new MoleculerServerError("Unable to compile OpenAPI schema", 500, "UNABLE_COMPILE_OPENAPI_SCHEMA", {
                        err,
                    });
                }
            },
        },
        /**
         * Créate /api route
         */
        created() {
            const SwaggerUiAbsolutePath = swagger_ui_dist_1.default.absolutePath();
            const route = lodash_1.default.defaultsDeep(mixinOptions.routeOptions, {
                use: [moleculer_web_1.default.serveStatic(SwaggerUiAbsolutePath, { index: false })],
                aliases: {
                    "GET /"(req, res) {
                        const ctx = req.$ctx;
                        // Generate swagger html
                        let swaggerHtml = null;
                        try {
                            swaggerHtml = this.swaggerGenerateHTML(this.settings.swaggerHtmlTpl, this.settings.swaggerOptions, externalUrl, this.accessToken(ctx.meta.user.token));
                        }
                        catch (err) {
                            this.logger.warn(err);
                            this.sendError(req, res, err);
                        }
                        ctx.meta.$responseType = "text/html";
                        return this.sendResponse(req, res, swaggerHtml);
                    },
                    "GET /index.html"(req, res) {
                        const ctx = req.$ctx;
                        // Generate swagger html
                        let swaggerHtml = null;
                        try {
                            swaggerHtml = this.swaggerGenerateHTML(this.settings.swaggerHtmlTpl, this.settings.swaggerOptions, externalUrl, this.accessToken(ctx.meta.user.token));
                        }
                        catch (err) {
                            this.logger.warn(err);
                            this.sendError(req, res, err);
                        }
                        ctx.meta.$responseType = "text/html";
                        return this.sendResponse(req, res, swaggerHtml);
                    },
                    "GET /api.json"(req, res) {
                        const ctx = req.$ctx;
                        const role = ctx.meta.user.scope;
                        // Send back the generated schema
                        // if (shouldUpdateSchema || !schema) {
                        // Create new server & regenerate GraphQL schema
                        this.logger.info("♻ Regenerate OpenAPI schema...");
                        try {
                            schema = this.generateOpenapiSchema(envUrl, this.settings.apiRoutesControllers, "api", role);
                            // shouldUpdateSchema = false;
                            this.logger.debug(schema);
                        }
                        catch (err) {
                            this.logger.warn(err);
                            this.sendError(req, res, err);
                        }
                        // }
                        ctx.meta.responseType = "application/json";
                        return this.sendResponse(req, res, schema);
                    },
                    "GET /meta.json"(req, res) {
                        const ctx = req.$ctx;
                        const role = ctx.meta.user.scope;
                        this.logger.info("♻ Regenerate OpenAPI schema...");
                        try {
                            schema = this.generateOpenapiSchema(envUrl, this.settings.apiRoutesControllers, "meta", role);
                            this.logger.debug(schema);
                        }
                        catch (err) {
                            this.logger.warn(err);
                            this.sendError(req, res, err);
                        }
                        ctx.meta.responseType = "application/json";
                        return this.sendResponse(req, res, schema);
                    },
                },
                mappingPolicy: "restrict",
            });
            // Add route to /support route
            this.settings.routes.unshift(route);
        },
        // eslint-disable-next-line @typescript-eslint/require-await
        started() {
            return __awaiter(this, void 0, void 0, function* () {
                this.logger.info(`📜 OpenAPI Docs server is available at ${externalUrl}/doc${mixinOptions.routeOptions.path}`);
            });
        },
    };
};
exports.OpenapiMixinFactory = OpenapiMixinFactory;
//# sourceMappingURL=openapi.mixin.js.map