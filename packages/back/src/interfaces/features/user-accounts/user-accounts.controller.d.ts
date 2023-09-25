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
import { JwtToken, MetaUser, OneOf, Payload, UserAccount, UserAccountsService } from "@edmp/api";
import { IUserAccountsService } from "@/interfaces";
import { SignOptions } from "jsonwebtoken";
import { CookieSerializeOptions } from "cookie";
import DeviceDetector from "device-detector-js";

/**
 * * Permanent
 */
// Name
type ServiceName = "controller.user-accounts";

// Actions
type ServiceActionsSchema = ServiceActionsSchemaCustom<
  ServiceSettingSchema,
  ServiceName,
  IUserAccountsController.Service,
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
  IUserAccountsController.Service,
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
  jwtOptions?: SignOptions;
  cookieName?: string;
  cookieOptions?: CookieSerializeOptions;
}

// Actions
type ServiceActionsNames = "create" | "get" | "update" | "login" | "login.get" | "login.renew" | "logout";
type CallActionsNamesAvailable = IUserAccountsController.CallActionsNames | IUserAccountsService.CallActionsNames;
type CallActionsContextAvailable = IUserAccountsController.CallActionsContext & IUserAccountsService.CallActionsContext;

// Events
type ServiceEventsNames = never;
type EmitEventsNamesAvailable = `${IUserAccountsController.EmitEventsNames}`;
type EmitEventsContextAvailable = IUserAccountsController.EmitEventsContext;

// Methods
type ServiceMethodsAvailable = IUserAccountsController.ServiceMethods;

/**
 * * Export
 */
export namespace IUserAccountsController {
  export type ServiceSchema = ServiceSchemaCustom<ServiceSettingSchema> & {
    name: ServiceName;
    // mixins: [];
    settings: ServiceSettingSchema;
    created: (this: Service) => void;
    // started: (this: Service) => Promise<void>;
    actions: ServiceActionsSchema;
    // events: ServiceEventsSchema;
    methods: ServiceMethods;
  };

  // Service (this)
  export type Service = ServiceCustom<ServiceSettingSchema, ServiceMethodsAvailable> & {
    deviceDetector?: DeviceDetector;
    schema: ServiceSchemaCustom<ServiceSettingSchema, ServiceMethodsAvailable> & {
      deviceDetector?: DeviceDetector;
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

  // Actions
  export type CallActionsNames = `${ServiceName}.${ServiceActionsNames}`;
  export interface CallActionsContext extends CallActionsContextCustom {
    // ! Route public
    "controller.user-accounts.create": {
      params: UserAccountsService.CreateIn;
      meta: { user: MetaUser };
      response: UserAccountsService.CreateOut;
    };
    "controller.user-accounts.get": {
      params: UserAccountsService.GetIn;
      meta: { user: MetaUser };
      response: UserAccountsService.GetOut;
    };
    "controller.user-accounts.update": {
      params: UserAccountsService.UpdateIn;
      meta: { user: MetaUser };
      response: UserAccountsService.UpdateOut;
    };
    // ! Route public
    "controller.user-accounts.login": {
      params: UserAccountsService.LoginIn;
      meta: { device: string; $responseHeaders?: { "Set-Cookie": string } };
      response: UserAccountsService.LoginOut;
    };
    "controller.user-accounts.login.get": {
      params: UserAccountsService.GetLoginIn;
      meta: { user: MetaUser };
      response: UserAccountsService.GetLoginOut;
    };
    "controller.user-accounts.logout": {
      params: UserAccountsService.LogoutIn;
      meta: { user: MetaUser; $responseHeaders?: { "Set-Cookie": string } };
      response: UserAccountsService.LogoutOut;
    };
    "controller.user-accounts.login.renew": {
      params: UserAccountsService.RenewLoginIn;
      meta: { user: MetaUser; device: string; $responseHeaders?: { "Set-Cookie": string } };
      response: UserAccountsService.RenewLoginOut;
    };
  }

  // Events
  export enum EmitEventsNames {
    LOGIN_SUCCESS = "userAccount.login.success",
    LOGIN_FAILURE = "userAccount.login.failure",
    LOGIN_RENEW = "userAccount.login.renew",
    LOGOUT = "userAccount.logout",
  }
  export interface EmitEventsContext extends EmitEventsContextCustom {
    [EmitEventsNames.LOGIN_SUCCESS]: {
      params: {
        device: DeviceDetector.DeviceDetectorResult;
        payload: Payload;
      };
      meta: { user: MetaUser };
    };
    [EmitEventsNames.LOGIN_FAILURE]: {
      params: {
        device: DeviceDetector.DeviceDetectorResult;
      } & OneOf<Pick<UserAccount, "id">, Pick<UserAccount, "username">>;
      meta: { user: MetaUser };
    };
    [EmitEventsNames.LOGIN_RENEW]: {
      params: {
        device: DeviceDetector.DeviceDetectorResult;
        payload: Payload;
      };
      meta: { user: MetaUser };
    };
    [EmitEventsNames.LOGOUT]: {
      params: Payload;
      meta: { user: MetaUser };
    };
  }

  // Methods
  export interface ServiceMethods extends ServiceMethodsCustom {
    sendToken(
      this: Service,
      ctx: Context<"controller.user-accounts.login" | "controller.user-accounts.login.renew">,
      payload: Payload
    ): JwtToken;
    cleanToken(this: Service, ctx: Context<"controller.user-accounts.login" | "controller.user-accounts.logout">): void;
  }
}
