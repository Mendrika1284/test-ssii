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
import { ConfigServiceMailer } from "@edmp/api";
import { SentMessageInfo } from "nodemailer/lib/smtp-transport";
import { Dictionary } from "lodash";

/**
 * * Permanent
 */
// Name
type ServiceName = "mixin.mailer";

// Actions
type ServiceActionsSchema = ServiceActionsSchemaCustom<
  ServiceSettingSchema,
  ServiceName,
  IMailerMixin.Service,
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
  IMailerMixin.Service,
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

//  actions
type ServiceActionsNames = never;
type CallActionsNamesAvailable = IMailerMixin.CallActionsNames;
type CallActionsContextAvailable = IMailerMixin.CallActionsContext;

// Events
type ServiceEventsNames = never;
type EmitEventsNamesAvailable = `${IMailerMixin.EmitEventsNames}`;
type EmitEventsContextAvailable = IMailerMixin.EmitEventsContext;

// Methods
type ServiceMethodsAvailable = IMailerMixin.ServiceMethods;

/**
 * * Export
 */
export namespace IMailerMixin {
  export type ServiceSchema = ServiceSchemaCustom<ServiceSettingSchema> & {
    name: ServiceName;
    // mixins: [];
    // settings: ServiceSettingSchema;
    // created: (this: Service) => void;
    started: (this: Service) => Promise<void>;
    stopped: (this: Service) => void;
    // actions: ServiceActionsSchema;
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

  // Events
  export enum EmitEventsNames {}
  export interface EmitEventsContext extends EmitEventsContextCustom {}

  // Actions
  export type CallActionsNames = `${ServiceName}.${ServiceActionsNames}`;
  export interface CallActionsContext extends CallActionsContextCustom {}

  // Methods
  export interface ServiceMethods<ServiceParent extends ServiceCustom = ServiceCustom> extends ServiceMethodsCustom {
    getTemplate(this: Service & ServiceParent, mailer: ConfigServiceMailer, templateName: string): string | undefined;
    sendMailWithAttachments(
      this: Service & ServiceParent,
      to: string,
      templateName: string,
      data?: Dictionary<string>,
      attachments?: Attachment[]
    ): Promise<Partial<SentMessageInfo>>;
    sendMail(
      this: Service & ServiceParent,
      parameters: {
        to: string;
        cc?: string[];
        templateName: string;
        data?: Dictionary<string>;
        attachments?: Attachment[];
      }
    ): Promise<Partial<SentMessageInfo>>;
    getMailer(this: Service & ServiceParent): Promise<ConfigServiceMailer>;
    verifyEmail(this: Service & ServiceParent): Promise<void>;
  }
}
