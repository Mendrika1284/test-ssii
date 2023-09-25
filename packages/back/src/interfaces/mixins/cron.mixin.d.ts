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
import { CronJobCustom, CronJobParametersCustom, CronTime } from "cron";

/**
 * * Permanent
 */
// Name
type ServiceName = "mixin.cron";

// Actions
type ServiceActionsSchema = ServiceActionsSchemaCustom<
  ServiceSettingSchema,
  ServiceName,
  ICronMixin.Service,
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
  ICronMixin.Service,
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
interface ServiceSettingSchema extends ServiceSettingSchemaCustom {
  cronJobs: CronJobCustom<ICronMixin.Service>[];
}

//  actions
type ServiceActionsNames = never;
type CallActionsNamesAvailable = ICronMixin.CallActionsNames;
type CallActionsContextAvailable = ICronMixin.CallActionsContext;

// Events
type ServiceEventsNames = never;
type EmitEventsNamesAvailable = `${ICronMixin.EmitEventsNames}`;
type EmitEventsContextAvailable = ICronMixin.EmitEventsContext;

// Methods
type ServiceMethodsAvailable = ICronMixin.ServiceMethods<ICronMixin.Service>;

/**
 * * Export
 */
export namespace ICronMixin {
  export type ServiceSchema = ServiceSchemaCustom<ServiceSettingSchema> & {
    name: ServiceName;
    // mixins: [];
    settings: ServiceSettingSchema;
    created: (this: Service) => void;
    started: (this: Service) => void;
    stopped: (this: Service) => void;
    // actions: ServiceActionsSchema;
    // events: ServiceEventsSchema;
    methods: ServiceMethods;
    crons?: CronJobParametersCustom<Service>[];
  };

  // Service (this)
  export type Service = ServiceCustom<ServiceSettingSchema, ServiceMethodsAvailable> & {
    schema: ServiceSchemaCustom<ServiceSettingSchema, ServiceMethodsAvailable> & {
      crons?: CronJobParametersCustom<ServiceCustom<ServiceSettingSchema> & ServiceMethodsAvailable>[];
    };
  };

  // Context
  export type Context<ThisName extends CallActionsNames | ServiceEventsNames> = ContextCustom<
    ThisName,
    CallActionsNamesAvailable,
    CallActionsContextAvailable,
    ServiceEventsNames,
    EmitEventsNamesAvailable,
    EmitEventsContextAvailable
  >;

  // Events
  export enum EmitEventsNames {}
  export interface EmitEventsContext extends EmitEventsContextCustom {}

  // Actions
  export type CallActionsNames = `${ServiceName}.${ServiceActionsNames}`;
  export interface CallActionsContext extends CallActionsContextCustom {}

  // Methods
  export interface ServiceMethods<ServiceParent extends ServiceCustom = ServiceCustom> extends ServiceMethodsCustom {
    getJob(this: Service & ServiceParent, name: string): ServiceSettingSchema["cronJobs"][number] | undefined;
    makeId(this: Service & ServiceParent): string;
    getCronTime(this: Service & ServiceParent, time: string): CronTime;
  }
}
