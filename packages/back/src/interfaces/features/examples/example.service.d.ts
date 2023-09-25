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
import { MetaUser, ExamplesService, Example, ExampleCreateInternal, ExampleUpdateInternal } from "@edmp/api";
import { IMailerMixin } from "@/interfaces";

/**
 * * Permanent
 */
// Name
type ServiceName = "service.examples";

// Actions
type ServiceActionsSchema = ServiceActionsSchemaCustom<
  ServiceSettingSchema,
  ServiceName,
  IExamplesService.Service,
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
  IExamplesService.Service,
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
type CallActionsNamesAvailable = IExamplesService.CallActionsNames;
type CallActionsContextAvailable = IExamplesService.CallActionsContext;

// Events
type ServiceEventsNames = never;
type EmitEventsNamesAvailable = `${IExamplesService.EmitEventsNames}`;
type EmitEventsContextAvailable = IExamplesService.EmitEventsContext;

// Methods
type ServiceMethodsAvailable = IExamplesService.ServiceMethods & IMailerMixin.ServiceMethods<IExamplesService.Service>;

/**
 * * Export
 */
export namespace IExamplesService {
  export type ServiceSchema = ServiceSchemaCustom<ServiceSettingSchema> & {
    name: ServiceName;
    mixins: [IMailerMixin.ServiceSchema];
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
    "service.examples.create": {
      params: ExampleCreateInternal;
      meta: { user: MetaUser };
      response: ExamplesService.CreateOut;
    };
    "service.examples.list": {
      params: Partial<ExamplesService.ListIn>;
      meta: { user: MetaUser };
      response: ExamplesService.ListOut;
    };
    "service.examples.get": {
      params: ExamplesService.GetIn;
      meta: { user: MetaUser };
      response: ExamplesService.GetOut | undefined;
    };
    "service.examples.update": {
      params: ExampleUpdateInternal;
      meta: { user: MetaUser };
      response: ExamplesService.UpdateOut;
    };
    "service.examples.delete": {
      params: ExamplesService.DeleteIn;
      meta: { user: MetaUser };
      response: ExamplesService.DeleteOut;
    };
  }

  // Events
  export enum EmitEventsNames {
    CREATED = "example.created",
    UPDATED = "example.updated",
    INVITE = "example.invite",
    DELETED = "example.deleted",
  }
  export interface EmitEventsContext extends EmitEventsContextCustom {
    [EmitEventsNames.CREATED]: {
      params: {
        params: CallActionsContext["service.examples.create"]["params"];
        example: Example;
      };
      meta: { user: MetaUser };
    };
    [EmitEventsNames.UPDATED]: {
      params: {
        params: CallActionsContext["service.examples.update"]["params"];
        example: Example;
      };
      meta: { user: MetaUser };
    };
    [EmitEventsNames.DELETED]: {
      params: {
        params: CallActionsContext["service.examples.delete"]["params"];
        example: Example;
      };
      meta: { user: MetaUser };
    };
  }

  // Methods
  export interface ServiceMethods extends ServiceMethodsCustom {}
}
