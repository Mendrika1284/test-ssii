/* eslint-disable @typescript-eslint/ban-types */
import { ConfigSettings } from "@edmp/api";
import { JSONSchemaType } from "ajv";
import { OpenAPIV3 } from "openapi-types";

declare module "moleculer" {
  interface BrokerOptions {
    $settings: ConfigSettings;
  }

  interface ActionCatalogListOptions {
    withActions?: boolean;
  }

  interface ServiceRegistry {
    getServiceList(opts?: ActionCatalogListOptions): ServiceSchema[];
  }

  // ToDo `ServiceActionsReservedPropertyNames` `ServiceSchemaCustom` à supprimer lorsque `ServiceSchemaCustom` ne sera plus utilsé car un nouveau est disponible plus bas
  type ServiceActionsReservedPropertyNames = ""; //"list" | "update" | "create" | "get" | "remove";
  type ServiceSchemaCustom<S = ServiceSettingSchema, M = ServiceMethods> = ServiceSchema<S> & {
    actions?: ServiceActionsSchema & { [key in ServiceActionsReservedPropertyNames]?: never };
    methods?: M;
  };

  /**
   * * Service (this)
   */
  type ServiceCustom<
    ServiceSetting = ServiceSettingSchemaCustom,
    Methods = ServiceMethodsCustom
  > = Service<ServiceSetting> & Methods;

  /**
   * * Context
   */
  type CallActionsContextCustom = {
    [callActionName: string]: {
      params: any | never;
      meta: object | never;
      local?: GenericObject;
      response: unknown;
    };
  };
  type EmitEventsContextCustom = {
    [emitEventName: string]: {
      params: any | never;
      meta: object | never;
      local?: GenericObject;
    };
  };

  interface ContextCustom<
    ThisName extends string = string,
    CallActionNamesAvailable extends const = const,
    CallActionsContextAvailable extends CallActionsContextCustom = CallActionsContextCustom,
    ServiceEventNames extends const = const,
    EmitEventNamesAvailable extends string = string,
    EmitEventsContextAvailable extends EmitEventsContextCustom = EmitEventsContextCustom
  > extends Context<
      ThisName extends CallActionNamesAvailable
        ? CallActionsContextAvailable[ThisName]["params"] extends never
          ? object
          : CallActionsContextAvailable[ThisName]["params"]
        : ThisName extends ServiceEventNames
        ? EmitEventsContextAvailable[ThisName]["params"] extends never
          ? object
          : EmitEventsContextAvailable[ThisName]["params"]
        : object,
      ThisName extends CallActionNamesAvailable
        ? CallActionsContextAvailable[ThisName]["meta"] extends never
          ? object
          : CallActionsContextAvailable[ThisName]["meta"]
        : ThisName extends ServiceEventNames
        ? EmitEventsContextAvailable[ThisName]["meta"] extends never
          ? object
          : EmitEventsContextAvailable[ThisName]["meta"]
        : object,
      ThisName extends CallActionNamesAvailable
        ? CallActionsContextAvailable[ThisName]["local"] extends object
          ? CallActionsContextAvailable[ThisName]["local"]
          : GenericObject
        : ThisName extends ServiceEventNames
        ? EmitEventsContextAvailable[ThisName]["local"] extends object
          ? EmitEventsContextAvailable[ThisName]["local"]
          : GenericObject
        : GenericObject
    > {
    name?: ThisName | undefined;

    call<
      CallActionName extends CallActionNamesAvailable,
      Res extends CallActionsContextAvailable[CallActionName]["response"]
    >(
      actionName: CallActionName
    ): Promise<Res>;
    call<
      CallActionName extends CallActionNamesAvailable,
      Params extends CallActionsContextAvailable[CallActionName]["params"],
      Res extends CallActionsContextAvailable[CallActionName]["response"]
    >(
      actionName: CallActionName,
      params: Params extends any ? Params : object,
      opts?: CallingOptions
    ): Promise<Res>;

    emit<EventName extends EmitEventNamesAvailable>(eventName: EventName): Promise<void>;
    emit<EventName extends EmitEventNamesAvailable>(
      eventName: EventName,
      params: EmitEventsContextAvailable[EventName]["params"],
      // eslint-disable-next-line @typescript-eslint/unified-signatures
      opts?: GenericObject
    ): Promise<void>;
    emit<EventName extends EmitEventNamesAvailable>(
      eventName: EventName,
      params: EmitEventsContextAvailable[EventName]["params"],
      groups: string | string[]
    ): Promise<void>;

    broadcast<EventName extends EmitEventNamesAvailable>(eventName: EventName): Promise<void>;
    broadcast<EventName extends EmitEventNamesAvailable>(
      eventName: EventName,
      params: EmitEventsContextAvailable[EventName]["params"],
      // eslint-disable-next-line @typescript-eslint/unified-signatures
      opts?: GenericObject
    ): Promise<void>;
    broadcast<EventName extends EmitEventNamesAvailable>(
      eventName: EventName,
      params: EmitEventsContextAvailable[EventName]["params"],
      groups: string | string[]
    ): Promise<void>;
  }

  /**
   * Methods
   */
  type ServiceMethodsCustom = ServiceMethods;

  /**
   * * Schemas
   */
  // Service
  type ServiceSchemaCustom<ServiceSetting = ServiceSettingSchemaCustom> = ServiceSchema<ServiceSetting>;

  // Settings
  type ServiceSettingSchemaCustom = ServiceSettingSchema;

  // Actions
  type ServiceActionsSchemaCustom<
    ServiceSetting extends ServiceSettingSchemaCustom = ServiceSettingSchemaCustom,
    ServiceName extends string = string,
    Svc extends Service = Service<ServiceSetting>,
    ServiceActionsNames extends string = string,
    CallActionsNamesAvailable extends string = string,
    CallActionsContextAvailable extends CallActionsContextCustom = CallActionsContextCustom,
    ServiceEventNames extends string = string,
    EmitEventNamesAvailable extends string = string,
    EmitEventsContextAvailable extends EmitEventsContextCustom = EmitEventsContextCustom
  > = {
    [ActionName in ServiceActionsNames]: Omit<ActionSchema<ServiceSetting>, "handler"> &
      (CallActionsContextAvailable[`${ServiceName}.${ActionName}`]["params"] extends never
        ? object
        : {
            params: JSONSchemaType<CallActionsContextAvailable[`${ServiceName}.${ActionName}`]["params"]>;
          }) & {
        openapi?: OpenAPIV3.OperationObjectWithPath;
        hooks?: {
          before?: (
            this: Svc,
            ctx: ContextCustom<
              `${ServiceName}.${ActionName}`,
              CallActionsNamesAvailable,
              CallActionsContextAvailable,
              ServiceEventNames,
              EmitEventNamesAvailable,
              EmitEventsContextAvailable
            >
          ) => Promise<void> | void;
          after?: (
            this: Svc,
            ctx: ContextCustom<
              `${ServiceName}.${ActionName}`,
              CallActionsNamesAvailable,
              CallActionsContextAvailable,
              ServiceEventNames,
              EmitEventNamesAvailable,
              EmitEventsContextAvailable
            >,
            res: CallActionsContextAvailable[`${ServiceName}.${ActionName}`]["response"]
          ) => Promise<any> | any;
          error?: (
            this: Svc,
            ctx: ContextCustom<
              `${ServiceName}.${ActionName}`,
              CallActionsNamesAvailable,
              CallActionsContextAvailable,
              ServiceEventNames,
              EmitEventNamesAvailable,
              EmitEventsContextAvailable
            >,
            err: Error
          ) => Promise<void> | void;
        };
        handler: (
          this: Svc,
          ctx: ContextCustom<
            `${ServiceName}.${ActionName}`,
            CallActionsNamesAvailable,
            CallActionsContextAvailable,
            ServiceEventNames,
            EmitEventNamesAvailable,
            EmitEventsContextAvailable
          >
        ) => Promise<CallActionsContextAvailable[`${ServiceName}.${ActionName}`]["response"]>;
      };
  } & ServiceActionsSchema<ServiceSetting>;

  // Events
  type ServiceEventsSchemaCustom<
    ServiceSetting extends ServiceSettingSchemaCustom = ServiceSettingSchemaCustom,
    Svc extends Service = Service<ServiceSetting>,
    CallActionsNamesAvailable extends string = string,
    CallActionsContextAvailable extends CallActionsContextCustom = CallActionsContextCustom,
    ServiceEventNames extends string = string,
    EmitEventNamesAvailable extends string = string,
    EmitEventsContextAvailable extends EmitEventsContextCustom = EmitEventsContextCustom
  > = {
    [EventName in ServiceEventNames]: Omit<ServiceEvent<ServiceSetting>, "handler"> & {
      handler: (
        this: Svc,
        ctx: ContextCustom<
          EventName,
          CallActionsNamesAvailable,
          CallActionsContextAvailable,
          ServiceEventNames,
          EmitEventNamesAvailable,
          EmitEventsContextAvailable
        >
      ) => void;
    };
  } & ServiceEvents;
}
