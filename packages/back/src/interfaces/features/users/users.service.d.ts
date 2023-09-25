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
  UsersService,
  User,
  OneOf,
  UserCreateInternal,
  UserCreate,
  UserUpdateInternalService,
  UserUpdateInternalRepository,
} from "@edmp/api";
import { IMailerMixin, IUserAccountsService } from "@/interfaces";

/**
 * * Permanent
 */
// Name
type ServiceName = "service.users";

// Actions
type ServiceActionsSchema = ServiceActionsSchemaCustom<
  ServiceSettingSchema,
  ServiceName,
  IUsersService.Service,
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
  IUsersService.Service,
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
type ServiceActionsNames = "create" | "list" | "get" | "update" | "validateEmail";
type CallActionsNamesAvailable = IUsersService.CallActionsNames | IUserAccountsService.CallActionsNames;
type CallActionsContextAvailable = IUsersService.CallActionsContext & IUserAccountsService.CallActionsContext;

// Events
type ServiceEventsNames = `${IUsersService.EmitEventsNames.EMAIL_UPDATED}`;
type EmitEventsNamesAvailable = `${IUsersService.EmitEventsNames}`;
type EmitEventsContextAvailable = IUsersService.EmitEventsContext;

// Methods
type ServiceMethodsAvailable = IUsersService.ServiceMethods & IMailerMixin.ServiceMethods<IUsersService.Service>;

/**
 * * Export
 */
export namespace IUsersService {
  export type ServiceSchema = ServiceSchemaCustom<ServiceSettingSchema> & {
    name: ServiceName;
    mixins: [IMailerMixin.ServiceSchema];
    // settings: ServiceSettingSchema;
    // created: (this: Service) => void;
    // started: (this: Service) => Promise<void>;
    actions: ServiceActionsSchema;
    events: ServiceEventsSchema;
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
    "service.users.create": {
      params: UserCreate;
      meta: { user: MetaUser };
      response: User;
    };
    "service.users.list": {
      params: Partial<Pick<User, "emailStatus"> & { ids: string[] }>;
      meta: { user: MetaUser };
      response: User[];
    };
    "service.users.get": {
      params: OneOf<UsersService.GetIn, Pick<User, "email">, Required<Pick<User, "emailVerifyToken">>>;
      meta: { user: MetaUser };
      response: UsersService.GetOut | undefined;
    };
    "service.users.update": {
      params: UserUpdateInternalService;
      meta: { user: MetaUser };
      response: UsersService.UpdateOut;
    };
    "service.users.validateEmail": {
      params: UsersService.ValidateEmailIn;
      meta: never;
      response: UsersService.ValidateEmailOut;
    };
  }

  // Events
  export enum EmitEventsNames {
    CREATED = "user.created",
    UPDATED = "user.updated",
    EMAIL_UPDATED = "user.email.updated",
  }
  export interface EmitEventsContext extends EmitEventsContextCustom {
    [EmitEventsNames.CREATED]: {
      params: {
        params: UserCreateInternal;
        user: User;
      };
      meta: { user: MetaUser };
    };
    [EmitEventsNames.UPDATED]: {
      params: {
        params: UserUpdateInternalRepository;
        user: User;
      };
      meta: { user: MetaUser };
    };
    [EmitEventsNames.EMAIL_UPDATED]: {
      params: {
        params: UserCreateInternal | UserUpdateInternalRepository;
        user: User;
      };
      meta: { user: MetaUser };
    };
  }

  // Methods
  export interface ServiceMethods extends ServiceMethodsCustom {
    processEmail<UserInternal extends UserCreateInternal | UserUpdateInternalRepository>(
      this: Service,
      ctx: Context<"service.users.create" | "service.users.update">,
      params: { user: UserInternal }
    ): Promise<UserInternal>;
  }
}
