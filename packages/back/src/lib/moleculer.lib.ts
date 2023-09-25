/* eslint-disable @typescript-eslint/ban-types */
import {
  ActionEndpoint,
  ContextCustom,
  EventEndpoint,
  Service,
  ServiceBroker,
  ServiceCustom,
  ServiceSchemaCustom,
  ServiceSettingSchemaCustom,
} from "moleculer";
import { system } from "./auth/system";

export namespace MoleculerLib {
  /**
   * Wait for the specified services to become available/registered with this broker.
   *
   * @param service The service instance
   * @param serviceNames The service, or services, we are waiting for.
   * @param timeout The total time this call may take. If this time has passed and the service(s)
   * 						    are not available an error will be thrown. (In milliseconds)
   * @param interval The time we will wait before once again checking if the service(s) are available (In milliseconds)
   */
  export const waitIsAvailableServices = async (
    service: Service,
    serviceNames: string | string[],
    timeout?: number,
    interval?: number
  ): Promise<boolean> => {
    const availableServices = await service.waitForServices(serviceNames, timeout, interval);
    return availableServices.statuses
      .filter(({ name }) => serviceNames.includes(name))
      .every(({ available }) => !!available);
  };

  /**
   * Create an moleculer context
   * @param service The service of the context
   * @param type Context type
   * @param name Context name available in service
   * @param meta Context meta, default: `system.getSystemMetaIfUserMetaNotExist`
   * @returns Context
   */
  export const createContext = <Context extends ContextCustom, CtxType extends "action" | "event" = "action" | "event">(
    service: Service,
    type: CtxType,
    name: NonNullable<Context["name"]>,
    meta: Context["meta"] = {}
  ): Context => {
    let typeName: Pick<EventEndpoint, "event"> | Pick<ActionEndpoint, "action"> | object = {};

    if (type === "action") {
      typeName = { action: { name } };
    }
    if (type === "event") {
      typeName = { event: { name } };
    }

    const ctx = new service.broker.ContextFactory<Context["name"], Context["params"], Context["meta"]>(
      service.broker,
      Object.assign(
        {
          broker: service.broker,
          id: service.broker.nodeID,
          node: {},
          local: true,
          state: true,
          service,
          meta: system.getSystemMetaIfUserMetaNotExist(meta),
        },
        typeName
      )
    );

    return ctx as Context;
  };

  /**
   * Create an local moleculer service
   */
  export const createLocalService = <Service extends ServiceCustom>(
    broker: ServiceBroker,
    schema: ServiceSchemaCustom<ServiceSettingSchemaCustom>,
    schemaMods?: ServiceSchemaCustom<ServiceSettingSchemaCustom>
  ): Service => {
    return broker.createService(schema, schemaMods) as Service;
  };

  /**
   * Get an local moleculer service
   */
  export const getLocalService = <Service extends ServiceCustom>(broker: ServiceBroker, name: string): Service => {
    return broker.getLocalService(name) as Service;
  };
}
