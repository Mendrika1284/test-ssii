/* eslint-disable @typescript-eslint/no-empty-interface */
import {
  CallActionsContextCustom,
  ContextCustom,
  EmitEventsContextCustom,
  ServiceActionsSchemaCustom,
  ServiceCustom,
  ServiceEventsSchemaCustom,
  ServiceMethodsCustom,
  ServiceSchemaCustom,
  ServiceSettingSchemaCustom,
} from "moleculer";
import { MetaUser } from "@edmp/api";
import { IExamplesService, ICronMixin, IMailerMixin } from "@/interfaces";
import { CronJobParametersCustom } from "cron";

/**
 * * Permanent
 */
// Name
type ServiceName = "cron.examples";

// Actions
type ServiceActionsSchema = ServiceActionsSchemaCustom<
  ServiceSettingSchema,
  ServiceName,
  IExamplesCron.Service,
  ServiceActionsNames,
  CallActionsNamesAvailable,
  CallActionsContextAvailable,
  ServiceEventsNames,
  EmitEventsNamesAvailable,
  EmitEventsContextAvailable
>;

// Events
type ServiceEventsSchema = ServiceEventsSchemaCustom<
  ServiceSettingSchema,
  IExamplesCron.Service,
  CallActionsNamesAvailable,
  CallActionsContextAvailable,
  ServiceEventsNames,
  EmitEventsNamesAvailable,
  EmitEventsContextAvailable
>;

/**
 * * Config
 */
// Settings
interface ServiceSettingSchema extends ServiceSettingSchemaCustom {}

// Actions
type ServiceActionsNames = "test";
type CallActionsNamesAvailable = IExamplesCron.CallActionsNames | IExamplesService.CallActionsNames;
type CallActionsContextAvailable = IExamplesCron.CallActionsContext & IExamplesService.CallActionsContext;

// Events
type ServiceEventsNames = "cron.examples.job.test";
type EmitEventsNamesAvailable = `${IExamplesCron.EmitEventsNames}`;
type EmitEventsContextAvailable = IExamplesCron.EmitEventsContext;

// Methods
type ServiceMethodsAvailable = IExamplesCron.ServiceMethods &
  ICronMixin.ServiceMethods<IExamplesCron.Service> &
  IMailerMixin.ServiceMethods<IExamplesCron.Service>;

/**
 * * Export
 */
export namespace IExamplesCron {
  export type ServiceSchema = ServiceSchemaCustom<ServiceSettingSchema> & {
    name: ServiceName;
    mixins: [ICronMixin.ServiceSchema, IMailerMixin.ServiceSchema];
    // settings: ServiceSettingSchema;
    // created: (this: Service) => void;
    // started: (this: Service) => Promise<void>;
    crons: CronJobParametersCustom<Service>[];
    actions: ServiceActionsSchema;
    // events: ServiceEventsSchema;
    // methods: ServiceMethods;
  };

  // Service (this)
  export type Service = ServiceCustom<ServiceSettingSchema, ServiceMethodsAvailable>;

  // Context
  export type Context<ThisName extends CallActionsNames | ServiceEventsNames> = ContextCustom<
    ThisName,
    CallActionsNamesAvailable,
    CallActionsContextAvailable,
    ServiceEventsNames,
    EmitEventsNamesAvailable,
    EmitEventsContextAvailable
  >;

  // Actions
  export type CallActionsNames = `${ServiceName}.${ServiceActionsNames}`;
  export interface CallActionsContext extends CallActionsContextCustom {
    "cron.examples.test": {
      params: never;
      meta: { user: MetaUser };
      response: void;
    };
  }

  // Events
  export enum EmitEventsNames {}
  export interface EmitEventsContext extends EmitEventsContextCustom {
    "cron.examples.job.test": {
      params: never;
      meta: { user: MetaUser };
      response: void;
    };
  }

  // Methods
  export interface ServiceMethods extends ServiceMethodsCustom {}
}
