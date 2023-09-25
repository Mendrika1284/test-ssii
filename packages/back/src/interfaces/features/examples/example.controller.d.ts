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
import { MetaUser, ExamplesService } from "@edmp/api";
import { IExamplesService } from "@/interfaces";

/**
 * * Permanent
 */
// Name
type ServiceName = "controller.examples";

// Actions
type ServiceActionsSchema = ServiceActionsSchemaCustom<
  ServiceSettingSchema,
  ServiceName,
  IExamplesController.Service,
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
  IExamplesController.Service,
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
type ServiceActionsNames = "create" | "list" | "get" | "update" | "delete";
type CallActionsNamesAvailable = IExamplesController.CallActionsNames | IExamplesService.CallActionsNames;
type CallActionsContextAvailable = IExamplesController.CallActionsContext & IExamplesService.CallActionsContext;

// Events
type ServiceEventsNames = never;
type EmitEventsNamesAvailable = `${IExamplesController.EmitEventsNames}`;
type EmitEventsContextAvailable = IExamplesController.EmitEventsContext;

// Methods
type ServiceMethodsAvailable = IExamplesController.ServiceMethods;

/**
 * * Export
 */
export namespace IExamplesController {
  export type ServiceSchema = ServiceSchemaCustom<ServiceSettingSchema> & {
    name: ServiceName;
    // mixins: [];
    // settings: ServiceSettingSchema;
    // created: (this: Service) => void;
    // started: (this: Service) => Promise<void>;
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
    "controller.examples.create": {
      params: ExamplesService.CreateIn;
      meta: { user: MetaUser };
      response: ExamplesService.CreateOut;
    };
    "controller.examples.list": {
      params: ExamplesService.ListIn;
      meta: { user: MetaUser };
      response: ExamplesService.ListOut;
    };
    "controller.examples.get": {
      params: ExamplesService.GetIn;
      meta: { user: MetaUser };
      response: ExamplesService.GetOut;
    };
    "controller.examples.update": {
      params: ExamplesService.UpdateIn;
      meta: { user: MetaUser };
      response: ExamplesService.UpdateOut;
    };
    "controller.examples.delete": {
      params: ExamplesService.DeleteIn;
      meta: { user: MetaUser };
      response: ExamplesService.DeleteOut;
    };
  }

  // Events
  export enum EmitEventsNames {}
  export interface EmitEventsContext extends EmitEventsContextCustom {}

  // Methods
  export interface ServiceMethods extends ServiceMethodsCustom {}
}
