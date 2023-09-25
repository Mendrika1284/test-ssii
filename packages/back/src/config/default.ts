/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConfigAppVersions,
  ConfigAppIdp,
  ConfigAppUser,
  ConfigGatewayDns,
  ConfigGatewayHelmet,
  ConfigGatewayRateLimit,
  ConfigGatewayToken,
  ConfigServiceMailer,
  ConfigSettings,
  DeepPartial,
  UserAccountCreateInternal,
} from "@edmp/api";
import { CookieSerializeOptions } from "cookie";
import { EventEmitter } from "events";
import Moleculer, {
  BrokerCircuitBreakerOptions,
  RetryPolicyOptions,
  BrokerOptions,
  ServiceSettingSchema,
  Service,
  ServiceCustom,
  ServiceBroker,
  ServiceSchema,
  GenericObject,
  Context,
  ContextCustom,
  ActionEndpoint,
  EventEndpoint,
  Endpoint,
} from "moleculer";
import MoleculerError = Moleculer.Errors.MoleculerError;

const backPackage: { version: string } = require("../../package.json");
const frontPackage: { version: string } = require("../../../front/package.json");
const apiPackage: { version: string } = require("../../../api/package.json");

// Get NODE_ENV and NODE_CONFIG_ENV, /!\ NODE_CONFIG_ENV overrides NODE_ENV (https://github.com/lorenwest/node-config/wiki/Environment-Variables#node_env)

// https://nodejs.org/docs/latest/api/events.html#events_emitter_setmaxlisteners_n
// class MyEmitter extends EventEmitter {}
//
// const myEmitter = new MyEmitter();
// myEmitter.on("event", () => {
//   console.log("an event occurred!");
// });

EventEmitter.defaultMaxListeners = 40;

// * Config
// Gateway
const configGatewayOrigin = ["http://localhost:8080", "http://localhost:8082"];
const configGatewayDns: DeepPartial<ConfigGatewayDns> = {
  url: "http://localhost:8080",
  trustProxy: false,
};

const configGatewayRateLimit: DeepPartial<ConfigGatewayRateLimit> = {
  limit: 400,
};

const configGatewayCookie: CookieSerializeOptions = {
  path: "/",
  secure: true,
  httpOnly: true,
  sameSite: true,
};

const configGatewayToken: DeepPartial<ConfigGatewayToken> = {
  audience: "edmp",
  issuer: "http://localhost:8080",
  secret: "ownily-effe7bae260ee52e292e306b0c98c06bd1ea543d",
  cookieName: "edmp",
  expiresIn: "30m",
  maxAge: "1h",
};

const Self = "'self'";
const UnsafeEval = "'unsafe-eval'";
const UnsafeInline = "'unsafe-inline'";
const configGatewayHelmet: DeepPartial<ConfigGatewayHelmet> = {
  /**
   * https://www.npmjs.com/package/helmet
   */
  contentSecurityPolicy: {
    //reportOnly: true,
    directives: {
      defaultSrc: [Self],
      imgSrc: [Self, "data:"],
      fontSrc: [Self, "data:", "https://fonts.gstatic.com/", "https://cdn.jsdelivr.net/npm/@mdi/"],
      styleSrc: [Self, "https://fonts.googleapis.com/", "https://cdn.jsdelivr.net/npm/@mdi/", UnsafeInline],
      scriptSrc: [Self, UnsafeEval, UnsafeInline],
      connectSrc: [Self, "https://entreprise.data.gouv.fr/"],
      frameSrc: [Self],
    },
  },
};

// Services
const configServiceMailer: DeepPartial<ConfigServiceMailer> = {
  // Config for node mailer : https://nodemailer.com/smtp/
  SMTP: {
    service: "Gmail",
    pool: true,
    secure: true,
    host: "smtp.gmail.com",
    auth: {
      user: "contact@ownily.fr",
      pass: "edmpbressst29!",
    },
    logger: true,
    debug: true,
  },
  defaults: {
    from: "Ownily <contact@ownily.fr>",
    // replyTo: "contact@ownily.fr",
    bcc: "Ownily <contact@ownily.fr>",
  },
};

const configAppUser: DeepPartial<ConfigAppUser> = {
  resetPasswordExpiration: 2, // hours
  emailVerifyExpiration: 48, //hours
};

const configAppIdp: DeepPartial<ConfigAppIdp> = {
  bcrypt: {
    iterations: 12,
  },
};

const configAppAdminUsers: DeepPartial<UserAccountCreateInternal[]> = [{ username: "admin", scope: "admin" }];

const configAppVersions: ConfigAppVersions = {
  back: backPackage.version,
  front: frontPackage.version,
  api: apiPackage.version,
};

// Config moleculer
const moleculerConfig: BrokerOptions | { $settings: DeepPartial<ConfigSettings> } = {
  // Namespace of nodes to segment your nodes on the same network.
  namespace: "ownily-default",

  // Custom ownily settings store. Store here what you want. Accessing: `broker.$settings`
  $settings: {
    logInternalEvents: false,
    gateway: {
      port: 8080,
      origin: configGatewayOrigin,
      dns: configGatewayDns,
      rateLimit: configGatewayRateLimit,
      cookie: configGatewayCookie,
      token: configGatewayToken,
      helmet: configGatewayHelmet,
    },
    services: {
      // To test if : https://mxtoolbox.com/ & https://www.mail-tester.com/?lang=fr
      mailer: configServiceMailer,
      mongo: "mongodb://127.0.0.1:27017/testing",
    },
    app: {
      identifiant: "ownily",
      user: configAppUser,
      idp: configAppIdp,
      adminUsers: configAppAdminUsers,
      versions: configAppVersions,
    },
  },

  transporter: "redis://127.0.0.1:6379",

  logger: {
    type: "Console",
    options: {
      level: "debug",
      colors: true,
      moduleColors: true,
      formatter: "short",
      objectPrinter: null,
      autoPadding: false,
    },
  },
  logLevel: "debug",

  // Define a serializer.
  // Available values: "JSON", "Avro", "ProtoBuf", "MsgPack", "Notepack", "Thrift".
  // More info: https://moleculer.services/docs/0.14/networking.html#Serialization
  serializer: "JSON",

  // Number of milliseconds to wait before reject a request with a RequestTimeout error. Disabled: 0
  requestTimeout: 0, //60 * 1000,

  // Retry policy settings. More info: https://moleculer.services/docs/0.14/fault-tolerance.html#Retry
  retryPolicy: {
    // Enable feature
    enabled: true,
    // Count of retries
    retries: 2,
    // First delay in milliseconds.
    delay: 100,
    // Maximum delay in milliseconds.
    maxDelay: 1000,
    // Backoff factor for delay. 2 means exponential backoff.
    factor: 2,
    // A function to check failed requests.
    check: (err: MoleculerError): boolean => err && !!err.retryable,
  } as RetryPolicyOptions & { check: (err: MoleculerError) => boolean },

  // Limit of calling level. If it reaches the limit, broker will throw an MaxCallLevelError error. (Infinite loop protection)
  maxCallLevel: 100,

  // Number of seconds to send heartbeat packet to other nodes.
  heartbeatInterval: 10,

  // Number of seconds to wait before setting node to unavailable status.
  heartbeatTimeout: 30,

  // Cloning the params of context if enabled. High performance impact, use it with caution!
  contextParamsCloning: false,

  // Tracking requests and waiting for running requests before shutting down. More info: https://moleculer.services/docs/0.14/context.html#Context-tracking
  tracking: {
    // Enable feature
    enabled: true,
    // Number of milliseconds to wait before shutting down the process.
    shutdownTimeout: 15 * 1000,
  },

  // Disable built-in request & emit balancer. (Transporter must support it, as well.). More info: https://moleculer.services/docs/0.14/networking.html#Disabled-balancer
  disableBalancer: false,

  // Settings of Service Registry. More info: https://moleculer.services/docs/0.14/registry.html
  registry: {
    // Define balancing strategy. More info: https://moleculer.services/docs/0.14/balancing.html
    // Available values: "RoundRobin", "Random", "CpuUsage", "Latency", "Shard"
    strategy: "RoundRobin",
    // Enable local action call preferring. Always call the local action instance if available.
    preferLocal: true,

    discoverer: {
      type: "Local",
      options: {
        // Send heartbeat in every 10 seconds
        heartbeatInterval: 10,

        // Heartbeat timeout in seconds
        heartbeatTimeout: 30,

        // Disable heartbeat checking & sending, if true
        disableHeartbeatChecks: false,

        // Disable removing offline nodes from registry, if true
        disableOfflineNodeRemoving: false,

        // Remove offline nodes after 10 minutes
        cleanOfflineNodesTimeout: 10 * 60,
      },
    },
  },

  // Settings of Circuit Breaker. More info: https://moleculer.services/docs/0.14/fault-tolerance.html#Circuit-Breaker
  circuitBreaker: {
    // Enable feature
    enabled: true,
    // Threshold value. 0.5 means that 50% should be failed for tripping.
    threshold: 0.5,
    // Minimum request count. Below it, CB does not trip.
    minRequestCount: 20,
    // Number of seconds for time window.
    windowTime: 60,
    // Number of milliseconds to switch from open to half-open state
    halfOpenTime: 10 * 1000,
    // A function to check failed requests.
    check: (err: MoleculerError): boolean => err && err.code >= 500,
  } as BrokerCircuitBreakerOptions & { check: (err: MoleculerError) => boolean },

  // Settings of bulkhead feature. More info: https://moleculer.services/docs/0.14/fault-tolerance.html#Bulkhead
  bulkhead: {
    // Enable feature.
    enabled: false,
    // Maximum concurrent executions.
    concurrency: 10,
    // Maximum size of queue
    maxQueueSize: 100,
  },

  cacher: {
    type: "Redis",
    options: {
      // Redis settings
      redis: "redis://127.0.0.1:6379",

      // Turns Redis client monitoring on.
      monitor: false,

      // Prefix for keys
      prefix: "CACHER",

      // Set Time-to-live to 30sec. Disabled: 0 or null
      ttl: 30,
      // Deep-clone the returned value
      clone: true,
    },
  },

  // Enable/disable built-in metrics function. More info: https://moleculer.services/docs/0.14/metrics.html
  metrics: {
    enabled: false,
  },

  // Enable built-in tracing function. More info: https://moleculer.services/docs/0.14/tracing.html
  tracing: {
    enabled: false,
    actions: true,
    events: true,
    stackTrace: true,
    // Available built-in exporters: "Console", "Datadog", "Event", "EventLegacy", "Jaeger", "Zipkin"
    exporter: {
      type: "Console", // Console exporter is only for development!
      options: {
        // Logging level
        level: "trace",
        // Using colors
        colors: true,
        // Width of row
        width: 80,
        // Gauge width in the row
        gaugeWidth: 30,
      },
    },
    tags: {
      action: {
        params: true,
        meta: [
          "statusCode",
          "user",
          "rep.$service",
          "rep.$ctx",
          "rep.$route",
          "reqHeaders.host",
          "reqHeaders.origin",
          "reqHeaders.referer",
        ],
        response: true,
      },
      event: {
        params: true,
        meta: [
          "statusCode",
          "user",
          "event",
          "rep._eventsCount",
          "rep.$service",
          "rep.$ctx",
          "rep.$route",
          "reqHeaders.host",
          "reqHeaders.origin",
          "reqHeaders.referer",
        ],
      },
    },
  },

  // Register custom middlewares
  middlewares: [],

  // Register custom REPL commands.
  replCommands: undefined,

  // Global handler for broker
  errorHandler(err: Error): Promise<void> {
    // /!\ If we log here exception we have many times the same LOG /!\
    // Because handler intercept many time the same exception in hook, router, controller, service, repository, etc...
    // We could also use "info" parameters to log only in some condition
    // logErrorMessage(this, err);
    // Throw further
    throw err;
  },

  // Custom Service class. If not null, broker will use it when creating services by service schema. Default: null
  ServiceFactory: class ServiceFactory<S = ServiceSettingSchema> extends Service<S> implements ServiceCustom<S> {
    constructor(broker: ServiceBroker, schema?: ServiceSchema<S>) {
      super(broker, schema);
    }
  },

  // Custom Context class. If not null, broker will use it when creating contexts for requests & events. Default: null
  ContextFactory: class ContextFactory<
      Name extends string | undefined,
      Params = unknown,
      // eslint-disable-next-line @typescript-eslint/ban-types
      Meta extends object = object,
      Locals = GenericObject
    >
    extends Context<Params, Meta, Locals>
    implements ContextCustom
  {
    name: Name | ActionEndpoint["action"]["name"] | EventEndpoint["event"]["name"];
    constructor(broker: ServiceBroker, endpoint: Endpoint) {
      super(broker, endpoint);

      if ((endpoint as ActionEndpoint | undefined)?.action) {
        this.name = (endpoint as ActionEndpoint).action.name;
      } else if ((endpoint as EventEndpoint | undefined)?.event) {
        this.name = (endpoint as EventEndpoint).event.name;
      }
    }
  },
};

export = {
  /**
   * Moleculer ServiceBroker configuration
   *
   * More info about options:
   *     https://moleculer.services/docs/0.14/configuration.html
   *
   *
   * Overwriting options in production:
   * ================================
   *  You can overwrite any option with environment variables.
   *  For example to overwrite the "logLevel" value, use `LOGLEVEL=warn` env var.
   *  To overwrite a nested parameter, e.g. retryPolicy.retries, use `RETRYPOLICY_RETRIES=10` env var.
   *
   *  To overwrite broker’s deeply nested default options, which are not presented in "moleculer.config.js",
   *  use the `MOL_` prefix and double underscore `__` for nested properties in .env file.
   *  For example, to set the cacher prefix to `MYCACHE`, you should declare an env var as `MOL_CACHER__OPTIONS__PREFIX=mycache`.
   *  It will set this:
   *  {
   *    cacher: {
   *      options: {
   *        prefix: "mycache"
   *      }
   *    }
   *  }
   */
  moleculer: moleculerConfig,
};
