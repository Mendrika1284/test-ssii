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
import {
  MetaUser,
  UserAccountsService,
  UserAccount,
  OneOf,
  UserAccountCreateInternal,
  UserAccountUpdateInternalRepository,
  UserAccountUpdateInternal,
  Payload,
} from "@edmp/api";
import { IMailerMixin, IUsersService } from "@/interfaces";

/**
 * * Permanent
 */
// Name
type ServiceName = "service.user-accounts";

// Actions
type ServiceActionsSchema = ServiceActionsSchemaCustom<
  ServiceSettingSchema,
  ServiceName,
  IUserAccountsService.Service,
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
  IUserAccountsService.Service,
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
type ServiceActionsNames = "create" | "get" | "update" | "verify";
type CallActionsNamesAvailable = IUserAccountsService.CallActionsNames | IUsersService.CallActionsNames;
type CallActionsContextAvailable = IUserAccountsService.CallActionsContext & IUsersService.CallActionsContext;

// Events
type ServiceEventsNames = "repository.connected";
type EmitEventsNamesAvailable = `${IUserAccountsService.EmitEventsNames}`;
type EmitEventsContextAvailable = IUserAccountsService.EmitEventsContext & {
  "repository.connected": {
    params: {
      status: string;
    };
    meta: { user: MetaUser };
  };
};

// Methods
type ServiceMethodsAvailable = IUserAccountsService.ServiceMethods &
  IMailerMixin.ServiceMethods<IUserAccountsService.Service>;

/**
 * * Export
 */
export namespace IUserAccountsService {
  export type ServiceSchema = ServiceSchemaCustom<ServiceSettingSchema> & {
    name: ServiceName;
    mixins: [IMailerMixin.ServiceSchema];
    // settings: ServiceSettingSchema;
    // created: (this: Service) => void;
    // started: (this: Service) => Promise<void>;
    actions: ServiceActionsSchema;
    events: ServiceEventsSchema;
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
    "service.user-accounts.create": {
      params: UserAccountCreateInternal;
      meta: { user: MetaUser };
      response: UserAccount;
    };
    "service.user-accounts.get": {
      params: OneOf<Pick<UserAccount, "id">, Pick<UserAccount, "username">>;
      meta: { user: MetaUser };
      response: UserAccountsService.GetOut | undefined;
    };
    "service.user-accounts.update": {
      params: UserAccountUpdateInternal;
      meta: { user: MetaUser };
      response: UserAccountsService.UpdateOut;
    };
    "service.user-accounts.verify": {
      params: OneOf<Pick<UserAccount, "id">, Pick<UserAccount, "username">>;
      meta: never;
      response: Payload | undefined;
    };
  }

  // Events
  export enum EmitEventsNames {
    CREATED = "user-account.created",
    UPDATED = "user-account.updated",
  }
  export interface EmitEventsContext extends EmitEventsContextCustom {
    [EmitEventsNames.CREATED]: {
      params: {
        params: UserAccountCreateInternal;
        userAccount: UserAccount;
      };
      meta: { user: MetaUser };
    };
    [EmitEventsNames.UPDATED]: {
      params: {
        params: UserAccountUpdateInternalRepository;
        userAccount: UserAccount;
      };
      meta: { user: MetaUser };
    };
  }

  // Methods
  export interface ServiceMethods extends ServiceMethodsCustom {}
}
