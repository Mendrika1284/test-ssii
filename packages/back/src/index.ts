/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-var-requires */
// Allow use short alias in import (ex: @/mixins)
import moduleAlias from "module-alias";

moduleAlias.addAliases({
  "@": `${__dirname}`,
});

import routes from "@/routes";

import Ajv from "ajv";
import addFormats from "ajv-formats";
import config from "config";

import Fastest from "fastest-validator";
import { BrokerOptions, GenericObject, ServiceBroker, Validators } from "moleculer";
import os from "os";
import shortid from "shortid";
import merge from "webpack-merge";
import { ConfigSettings, DeepPartial } from "@edmp/api";
import { RethrowError, ValidationError } from "@/lib/error";
import _ from "lodash";
import { RepositoryLib } from "@/lib";
import path from "path";
export const buildBroker = async (port?: number): Promise<ServiceBroker> => {
  /**
   * Validator
   * - https://github.com/zhaoyao91/moleculer-json-schema-validator
   * - https://ajv.js.org/guide/typescript.html
   * - https://ajv.js.org/json-schema.html#nullable
   * - https://github.com/ajv-validator/ajv/blob/v7.2.4/docs/strict-mode.md#unknown-keywords
   *    ajv.addVocabulary([]);
   */
  class BaseValidator extends Validators.Base {
    validator: { fastest: Fastest; ajv: Ajv };

    constructor() {
      super();
      this.validator = {
        fastest: new Fastest(),
        ajv: new Ajv({
          removeAdditional: true,
          useDefaults: true,
          coerceTypes: true,
          allErrors: true,
        }),
      };
      addFormats(this.validator.ajv, ["date", "time"]);
    }

    validate(params: GenericObject, schema: GenericObject): boolean {
      let isValid;
      try {
        if (
          schema.hasOwnProperty("type") &&
          schema.type == "object" &&
          (schema.hasOwnProperty("properties") ||
            schema.hasOwnProperty("oneOf") ||
            schema.hasOwnProperty("allOf") ||
            schema.hasOwnProperty("anyOf"))
        ) {
          isValid = this.validator.ajv.validate(schema, params);
        } else {
          isValid = !!this.validator.fastest.validate(params, schema);
        }
      } catch (err) {
        throw new RethrowError(err as Error, {
          validateError: {
            params,
            schema,
          },
        });
      }
      if (isValid) {
        return true;
      } else {
        throw new ValidationError("Parameters validation error!", {
          validateError: {
            params,
            schema,
          },
        });
      }
    }

    compile(schema: GenericObject): (params: GenericObject) => boolean {
      return (params: GenericObject) => this.validate(params, schema);
    }
  }

  /**
   * Moleculer
   */

  // Get NODE_ENV and NODE_CONFIG_ENV, /!\ NODE_CONFIG_ENV overrides NODE_ENV (https://github.com/lorenwest/node-config/wiki/Environment-Variables#node_env)
  const environment = config.util.getEnv("NODE_CONFIG_ENV");

  /* For CI test:  Checking if the environment variable MEMORY_DB is set. If it is, it creates a new MongoMemoryServer instance with a random port number.
    Dynamic import because the node module is in devDependencies */
  const mongoMemoryServer = process.env.MEMORY_DB
    ? new (await import("mongodb-memory-server")).MongoMemoryServer({
        instance: { port: Math.floor(Math.random() * (65535 - 10000 + 1) + 10000) },
      }) // number between 10000 and 65535
    : undefined;

  // Setup Moleculer dynamic config
  const moleculerConfig: BrokerOptions | { $settings: DeepPartial<ConfigSettings> } = {
    // Unique node identifier. Must be unique in a namespace.
    nodeID: `node-${environment}-${shortid.generate()}`,

    $settings: {
      environment: environment,
      gateway: { port: port },
      services: { mailer: {} },
    },

    // Enable action & event parameter validation. More info: https://moleculer.services/docs/0.14/validating.html
    validator: new BaseValidator(),

    created(broker: ServiceBroker) {
      broker.logger.info("Moleculer Options:", broker.options);
    },

    async started(broker: ServiceBroker) {
      try {
        await RepositoryLib.connect(broker);

        broker.logger.info("Elastic APM started");
      } catch (error) {
        broker.logger.error({ error }, "Index started error");
      }

      void broker.emit("server.started", {
        arch: process.arch,
        platform: process.platform,
        hostname: os.hostname(),
        pid: process.pid,
        mem: `${os.freemem()}/${os.totalmem()}`,
        cpus: `${os.cpus().length}`,
        environment: broker.options.$settings.environment,
        port: broker.options.$settings.gateway.port,
      });
    },

    async stopped() {
      await RepositoryLib.disconnect();

      /* For CI test: Stopping the mongo memory server. */
      if (mongoMemoryServer) {
        await mongoMemoryServer.stop();
      }
    },
  };

  /* For CI test: Setting up a mongo memory server. */
  if (mongoMemoryServer) {
    await mongoMemoryServer.start();
    moleculerConfig.$settings.services = _.merge(moleculerConfig.$settings.services, {
      mongo: mongoMemoryServer.getUri(),
    });
  }

  // Merge Moleculer dynamic config in static config
  const moleculerOptions: BrokerOptions = merge(config.get("moleculer"), moleculerConfig as unknown as BrokerOptions);

  return new ServiceBroker(moleculerOptions);
};

export const buildService = async (port?: number): Promise<ServiceBroker> => {
  const broker = await buildBroker(port);

  const featuresPath = path.join(__dirname, "features");
  const featurePathAndSub = (featuresName: string) => path.join(featuresPath, featuresName, "**");
  const controllerServiceFileMask = "*.{controller,service,cron}.{ts,js}";

  /**
   * Routes
   */
  broker.createService(routes(broker));

  /**
   * Services
   */
  broker.loadServices(featurePathAndSub("user-accounts"), controllerServiceFileMask);
  broker.loadServices(featurePathAndSub("users"), controllerServiceFileMask);
  broker.loadServices(featurePathAndSub("examples"), controllerServiceFileMask);

  return broker;
};

// Module
// ------
module.exports = { buildBroker, buildService };

if (require.main === module) {
  require("make-promises-safe");

  console.log("Started services...");

  const init = async () => {
    // Build broker and service
    try {
      const broker = await buildService();
      // Start broker
      await broker.start();
      broker.logger.info("Server is ready");
    } catch (err) {
      console.error("Server not started", err);
      throw err;
    }
  };

  void init();
}
