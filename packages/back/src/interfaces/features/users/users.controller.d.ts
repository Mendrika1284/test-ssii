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
import { MetaUser, UsersService } from "@edmp/api";
import { IUsersService } from "@/interfaces";

/**
 * * Permanent
 */
// Name
type ServiceName = "controller.users";

// Actions
type ServiceActionsSchema = ServiceActionsSchemaCustom<
  ServiceSettingSchema,
  ServiceName,
  IUsersController.Service,
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
  IUsersController.Service,
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
type ServiceActionsNames = "get" | "update" | "validateEmail";
type CallActionsNamesAvailable = IUsersController.CallActionsNames | IUsersService.CallActionsNames;
type CallActionsContextAvailable = IUsersController.CallActionsContext & IUsersService.CallActionsContext;

// Events
type ServiceEventsNames = never;
type EmitEventsNamesAvailable = `${IUsersController.EmitEventsNames}`;
type EmitEventsContextAvailable = IUsersController.EmitEventsContext;

// Methods
type ServiceMethodsAvailable = IUsersController.ServiceMethods;

/**
 * * Export
 */
export namespace IUsersController {
  export type ServiceSchema = ServiceSchemaCustom<ServiceSettingSchema> & {
    name: ServiceName;
    // mixins: [];
    // settings: ServiceSettingSchema;
    // created: (this: Service) => void;
    // started: (this: Service) => Promise<void>;
    actions: ServiceActionsSchema;
    // events: ServiceEventsSchema;
    methods: ServiceMethods;
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
    "controller.users.get": {
      params: UsersService.GetIn;
      meta: { user: MetaUser };
      response: UsersService.GetOut;
    };
    "controller.users.update": {
      params: UsersService.UpdateIn;
      meta: { user: MetaUser };
      response: UsersService.UpdateOut;
    };
    // ! Route public
    "controller.users.validateEmail": {
      params: UsersService.ValidateEmailIn;
      meta: never;
      response: UsersService.ValidateEmailOut;
    };
  }

  // Events
  export enum EmitEventsNames {}
  export interface EmitEventsContext extends EmitEventsContextCustom {}

  // Methods
  export interface ServiceMethods extends ServiceMethodsCustom {
    initUserMe(ctx: Context<"controller.users.get" | "controller.users.update">): void;
  }
}
