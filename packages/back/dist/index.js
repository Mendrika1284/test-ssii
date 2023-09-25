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
exports.buildService = exports.buildBroker = void 0;
/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-var-requires */
// Allow use short alias in import (ex: @/mixins)
const module_alias_1 = __importDefault(require("module-alias"));
module_alias_1.default.addAliases({
    "@": `${__dirname}`,
});
const routes_1 = __importDefault(require("@/routes"));
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const config_1 = __importDefault(require("config"));
const fastest_validator_1 = __importDefault(require("fastest-validator"));
const moleculer_1 = require("moleculer");
const os_1 = __importDefault(require("os"));
const shortid_1 = __importDefault(require("shortid"));
const webpack_merge_1 = __importDefault(require("webpack-merge"));
const error_1 = require("@/lib/error");
const lodash_1 = __importDefault(require("lodash"));
const lib_1 = require("@/lib");
const path_1 = __importDefault(require("path"));
const buildBroker = (port) => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * Validator
     * - https://github.com/zhaoyao91/moleculer-json-schema-validator
     * - https://ajv.js.org/guide/typescript.html
     * - https://ajv.js.org/json-schema.html#nullable
     * - https://github.com/ajv-validator/ajv/blob/v7.2.4/docs/strict-mode.md#unknown-keywords
     *    ajv.addVocabulary([]);
     */
    class BaseValidator extends moleculer_1.Validators.Base {
        constructor() {
            super();
            this.validator = {
                fastest: new fastest_validator_1.default(),
                ajv: new ajv_1.default({
                    removeAdditional: true,
                    useDefaults: true,
                    coerceTypes: true,
                    allErrors: true,
                }),
            };
            (0, ajv_formats_1.default)(this.validator.ajv, ["date", "time"]);
        }
        validate(params, schema) {
            let isValid;
            try {
                if (schema.hasOwnProperty("type") &&
                    schema.type == "object" &&
                    (schema.hasOwnProperty("properties") ||
                        schema.hasOwnProperty("oneOf") ||
                        schema.hasOwnProperty("allOf") ||
                        schema.hasOwnProperty("anyOf"))) {
                    isValid = this.validator.ajv.validate(schema, params);
                }
                else {
                    isValid = !!this.validator.fastest.validate(params, schema);
                }
            }
            catch (err) {
                throw new error_1.RethrowError(err, {
                    validateError: {
                        params,
                        schema,
                    },
                });
            }
            if (isValid) {
                return true;
            }
            else {
                throw new error_1.ValidationError("Parameters validation error!", {
                    validateError: {
                        params,
                        schema,
                    },
                });
            }
        }
        compile(schema) {
            return (params) => this.validate(params, schema);
        }
    }
    /**
     * Moleculer
     */
    // Get NODE_ENV and NODE_CONFIG_ENV, /!\ NODE_CONFIG_ENV overrides NODE_ENV (https://github.com/lorenwest/node-config/wiki/Environment-Variables#node_env)
    const environment = config_1.default.util.getEnv("NODE_CONFIG_ENV");
    /* For CI test:  Checking if the environment variable MEMORY_DB is set. If it is, it creates a new MongoMemoryServer instance with a random port number.
      Dynamic import because the node module is in devDependencies */
    const mongoMemoryServer = process.env.MEMORY_DB
        ? new (yield Promise.resolve().then(() => __importStar(require("mongodb-memory-server")))).MongoMemoryServer({
            instance: { port: Math.floor(Math.random() * (65535 - 10000 + 1) + 10000) },
        }) // number between 10000 and 65535
        : undefined;
    // Setup Moleculer dynamic config
    const moleculerConfig = {
        // Unique node identifier. Must be unique in a namespace.
        nodeID: `node-${environment}-${shortid_1.default.generate()}`,
        $settings: {
            environment: environment,
            gateway: { port: port },
            services: { mailer: {} },
        },
        // Enable action & event parameter validation. More info: https://moleculer.services/docs/0.14/validating.html
        validator: new BaseValidator(),
        created(broker) {
            broker.logger.info("Moleculer Options:", broker.options);
        },
        started(broker) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    yield lib_1.RepositoryLib.connect(broker);
                    broker.logger.info("Elastic APM started");
                }
                catch (error) {
                    broker.logger.error({ error }, "Index started error");
                }
                void broker.emit("server.started", {
                    arch: process.arch,
                    platform: process.platform,
                    hostname: os_1.default.hostname(),
                    pid: process.pid,
                    mem: `${os_1.default.freemem()}/${os_1.default.totalmem()}`,
                    cpus: `${os_1.default.cpus().length}`,
                    environment: broker.options.$settings.environment,
                    port: broker.options.$settings.gateway.port,
                });
            });
        },
        stopped() {
            return __awaiter(this, void 0, void 0, function* () {
                yield lib_1.RepositoryLib.disconnect();
                /* For CI test: Stopping the mongo memory server. */
                if (mongoMemoryServer) {
                    yield mongoMemoryServer.stop();
                }
            });
        },
    };
    /* For CI test: Setting up a mongo memory server. */
    if (mongoMemoryServer) {
        yield mongoMemoryServer.start();
        moleculerConfig.$settings.services = lodash_1.default.merge(moleculerConfig.$settings.services, {
            mongo: mongoMemoryServer.getUri(),
        });
    }
    // Merge Moleculer dynamic config in static config
    const moleculerOptions = (0, webpack_merge_1.default)(config_1.default.get("moleculer"), moleculerConfig);
    return new moleculer_1.ServiceBroker(moleculerOptions);
});
exports.buildBroker = buildBroker;
const buildService = (port) => __awaiter(void 0, void 0, void 0, function* () {
    const broker = yield (0, exports.buildBroker)(port);
    const featuresPath = path_1.default.join(__dirname, "features");
    const featurePathAndSub = (featuresName) => path_1.default.join(featuresPath, featuresName, "**");
    const controllerServiceFileMask = "*.{controller,service,cron}.{ts,js}";
    /**
     * Routes
     */
    broker.createService((0, routes_1.default)(broker));
    /**
     * Services
     */
    broker.loadServices(featurePathAndSub("user-accounts"), controllerServiceFileMask);
    broker.loadServices(featurePathAndSub("users"), controllerServiceFileMask);
    broker.loadServices(featurePathAndSub("examples"), controllerServiceFileMask);
    return broker;
});
exports.buildService = buildService;
// Module
// ------
module.exports = { buildBroker: exports.buildBroker, buildService: exports.buildService };
if (require.main === module) {
    require("make-promises-safe");
    console.log("Started services...");
    const init = () => __awaiter(void 0, void 0, void 0, function* () {
        // Build broker and service
        try {
            const broker = yield (0, exports.buildService)();
            // Start broker
            yield broker.start();
            broker.logger.info("Server is ready");
        }
        catch (err) {
            console.error("Server not started", err);
            throw err;
        }
    });
    void init();
}
//# sourceMappingURL=index.js.map