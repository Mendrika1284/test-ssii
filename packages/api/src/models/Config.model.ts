import { UserAccount } from "../";
import { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { CookieSerializeOptions } from "cookie";
import { Dictionary } from "lodash";

// * Gateway
export interface ConfigGatewayDns {
  url: string;
  trustProxy: boolean;
}

export interface ConfigGatewayRateLimit {
  limit: number;
}

export interface ConfigGatewayToken {
  audience: string;
  cookieName: string | null;
  expiresIn: string;
  maxAge: string;
  issuer: string;
  secret: string;
  // cookieName: string;
}

export interface ConfigGatewayHelmet {
  contentSecurityPolicy: {
    useDefaults?: boolean;
    directives?: Record<string, null | Iterable<string>>;
    reportOnly?: boolean;
  };
}

// * Services
export interface ConfigServiceMailer {
  SMTP?: SMTPTransport.Options & { pool: boolean };
  defaults?: SMTPTransport.Options;
  transport?: Transporter<SMTPTransport.SentMessageInfo>;
  precompiledMailTemplates?: Dictionary<string>;
}

// * App
export interface ConfigAppUser {
  resetPasswordExpiration: number;
  emailVerifyExpiration: number;
}

export interface ConfigAppIdp {
  bcrypt: {
    iterations: number;
  };
}

export interface ConfigAppVersions {
  back: string;
  front: string;
  api: string;
}

// * ConfigSettings
export interface ConfigSettings {
  logInternalEvents: boolean;
  environment: string;
  gateway: {
    port: number;
    origin: string[];
    dns: ConfigGatewayDns;
    rateLimit: ConfigGatewayRateLimit;
    cookie: CookieSerializeOptions;
    token: ConfigGatewayToken;
    helmet: ConfigGatewayHelmet;
  };
  services: {
    mongo: string;
    mailer: ConfigServiceMailer;
  };
  app: {
    identifiant: string;
    user: ConfigAppUser;
    idp: ConfigAppIdp;
    adminUsers: UserAccount[];
    versions: ConfigAppVersions;
  };
}
