import { readFileSync } from "fs";
import { Errors } from "moleculer";
import { render } from "mustache";
import nodemailer from "nodemailer";
import { join } from "path";
import { Options, PluginFunction } from "nodemailer/lib/mailer";
import { IMailerMixin } from "@/interfaces";
import { marked } from "marked";
import SMTPTransport from "nodemailer/lib/smtp-transport";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { markdown } = require("nodemailer-markdown") as NodeMailerMarkdown;

// Debug with https://mailtrap.io/

type NodeMailerMarkdown = {
  markdown: (
    options?: marked.Renderer & { useEmbeddedImages: boolean }
  ) => PluginFunction<SMTPTransport.SentMessageInfo>;
};

export const MailerMixin: IMailerMixin.ServiceSchema = {
  name: "mixin.mailer",

  async started() {
    try {
      // We try to init mailer at init
      await this.getMailer();
    } catch (error) {
      this.logger.warn(`Mailer transport init failed at starting, we retry later: ${error}`);
    }
  },

  stopped() {
    const configMailer = this.broker.options.$settings.services.mailer;
    if (configMailer.transport) {
      configMailer.transport.close();
      // reset
      this.broker.options.$settings.services.mailer = {};
    }
  },

  methods: {
    /**
     * Get template renderer by name
     */
    getTemplate(mailer, templateName) {
      if (mailer.precompiledMailTemplates) {
        if (Object.keys(mailer.precompiledMailTemplates).includes(templateName)) {
          return mailer.precompiledMailTemplates[templateName];
        } else {
          const fileName = join(__dirname, `../resources/templates/mail/${templateName}.md`);
          const template = readFileSync(fileName, "utf8");
          mailer.precompiledMailTemplates[templateName] = template;
          return template;
        }
      }
    },

    async sendMailWithAttachments(to, templateName, data = {}, attachments = []) {
      return await this.sendMail({ to, templateName, data, attachments });
    },

    async sendMail({ to, cc, templateName, data = {}, attachments = [] }) {
      if (this.broker.options.$settings.services.mailer.SMTP?.host === "mock") {
        return {};
      }

      try {
        const { environment } = this.broker.options.$settings;
        const mailer = await this.getMailer();
        if (!mailer.transport) {
          return {};
        }
        const mailData = { to, templateName, data };
        const template = this.getTemplate(mailer, templateName);
        if (!template) {
          return {};
        }

        // Ajout de l'url du site pour tous les templates
        data["url"] = this.broker.options.$settings.gateway.dns.url || "http://app.ownily.fr/";

        const mail = render(template, data).split("\n");
        const subject = mail.shift();
        const content = mail.join("\n");
        const msg: Options & { markdown: string } = {
          to,
          cc,
          subject: environment === "production" ? subject : `${environment.toUpperCase()} | ${subject}`,
          markdown: content,
          attachments,
        };

        this.logger.debug(`Sending email to ${msg.to} with subject ${msg.subject}...`);

        const info = await mailer.transport.sendMail(msg);

        // Rejected infos work with OVH but not with google Mailer
        if (info.rejected.length > 0) {
          // We verify if emails are not rejected
          // rejectedErrors is missing in https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/nodemailer/lib/sendmail-transport/index.d.ts

          if (info.rejected.includes(to)) {
            // mail:to could be incorrect so we trace in warning
            this.logger.warn(`Email message rejected : ${to}`);
          }

          if (info.rejected.some((value) => value !== to)) {
            // but other mail : from, replyTo in config default.ts
            this.logger.error({ mailData }, `Email message rejected : ${info}`);
            this.broker.emit("email.failed", { mailData }).catch(() => this.logger.error("Error Emit email.failed"));
          }
        } else {
          this.broker.emit("email.sent", { mailData }).catch(() => this.logger.error("Error emit email.send"));
        }

        return info;
      } catch (error) {
        this.logger.error(`Email message error : ${error} for template : ${templateName} and to : ${to}`);
        this.broker.emit("email.failed", error).catch((reason) => this.logger.warn("error in emit email.fail"));

        // Check EMAIL Transport ?

        throw new Errors.MoleculerError(`Unable to send email! + ${error}`);
      }
    },

    async getMailer() {
      if (this.broker.options.$settings.services.mailer.SMTP?.host === "mock") {
        return {};
      }
      // Reference to Mailer Object in Broker metadata
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const mailerMetadata = this.broker.options.$settings.services.mailer;

      try {
        // Check if Mailer connection is already open
        if (!mailerMetadata?.transport) {
          //  Open a connection to TLS server
          const mailerTransport = nodemailer.createTransport(mailerMetadata?.SMTP, mailerMetadata.defaults);
          if (mailerTransport) {
            mailerTransport.use("compile", markdown());
            // Set mailer in broker metadata before to verify() in order to lock getMailer() at starting
            mailerMetadata.transport = mailerTransport;
            mailerMetadata.precompiledMailTemplates = {};
          }

          // Verify transport => It could take a time
          await mailerTransport.verify();
        }

        return mailerMetadata;
      } catch (error) {
        // If error is detected during verification : we reset connection
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.broker.options.$settings.services.mailer = {};

        this.logger.warn(`Email message error: ${error}`);
        throw error;
      }
    },

    async verifyEmail() {
      const mailerTransport = this.broker.options.$settings.services.mailer.transport;
      try {
        if (mailerTransport) {
          await mailerTransport.verify();
        }
      } catch (error) {
        // If error is detected during verification : we reset to retry later.
        this.broker.options.$settings.services.mailer = {};
      }
    },
  },
};
