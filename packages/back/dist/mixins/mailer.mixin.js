"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerMixin = void 0;
const fs_1 = require("fs");
const moleculer_1 = require("moleculer");
const mustache_1 = require("mustache");
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = require("path");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { markdown } = require("nodemailer-markdown");
exports.MailerMixin = {
    name: "mixin.mailer",
    started() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // We try to init mailer at init
                yield this.getMailer();
            }
            catch (error) {
                this.logger.warn(`Mailer transport init failed at starting, we retry later: ${error}`);
            }
        });
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
                }
                else {
                    const fileName = (0, path_1.join)(__dirname, `../resources/templates/mail/${templateName}.md`);
                    const template = (0, fs_1.readFileSync)(fileName, "utf8");
                    mailer.precompiledMailTemplates[templateName] = template;
                    return template;
                }
            }
        },
        sendMailWithAttachments(to, templateName, data = {}, attachments = []) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.sendMail({ to, templateName, data, attachments });
            });
        },
        sendMail({ to, cc, templateName, data = {}, attachments = [] }) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                if (((_a = this.broker.options.$settings.services.mailer.SMTP) === null || _a === void 0 ? void 0 : _a.host) === "mock") {
                    return {};
                }
                try {
                    const { environment } = this.broker.options.$settings;
                    const mailer = yield this.getMailer();
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
                    const mail = (0, mustache_1.render)(template, data).split("\n");
                    const subject = mail.shift();
                    const content = mail.join("\n");
                    const msg = {
                        to,
                        cc,
                        subject: environment === "production" ? subject : `${environment.toUpperCase()} | ${subject}`,
                        markdown: content,
                        attachments,
                    };
                    this.logger.debug(`Sending email to ${msg.to} with subject ${msg.subject}...`);
                    const info = yield mailer.transport.sendMail(msg);
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
                    }
                    else {
                        this.broker.emit("email.sent", { mailData }).catch(() => this.logger.error("Error emit email.send"));
                    }
                    return info;
                }
                catch (error) {
                    this.logger.error(`Email message error : ${error} for template : ${templateName} and to : ${to}`);
                    this.broker.emit("email.failed", error).catch((reason) => this.logger.warn("error in emit email.fail"));
                    // Check EMAIL Transport ?
                    throw new moleculer_1.Errors.MoleculerError(`Unable to send email! + ${error}`);
                }
            });
        },
        getMailer() {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                if (((_a = this.broker.options.$settings.services.mailer.SMTP) === null || _a === void 0 ? void 0 : _a.host) === "mock") {
                    return {};
                }
                // Reference to Mailer Object in Broker metadata
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                const mailerMetadata = this.broker.options.$settings.services.mailer;
                try {
                    // Check if Mailer connection is already open
                    if (!(mailerMetadata === null || mailerMetadata === void 0 ? void 0 : mailerMetadata.transport)) {
                        //  Open a connection to TLS server
                        const mailerTransport = nodemailer_1.default.createTransport(mailerMetadata === null || mailerMetadata === void 0 ? void 0 : mailerMetadata.SMTP, mailerMetadata.defaults);
                        if (mailerTransport) {
                            mailerTransport.use("compile", markdown());
                            // Set mailer in broker metadata before to verify() in order to lock getMailer() at starting
                            mailerMetadata.transport = mailerTransport;
                            mailerMetadata.precompiledMailTemplates = {};
                        }
                        // Verify transport => It could take a time
                        yield mailerTransport.verify();
                    }
                    return mailerMetadata;
                }
                catch (error) {
                    // If error is detected during verification : we reset connection
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    this.broker.options.$settings.services.mailer = {};
                    this.logger.warn(`Email message error: ${error}`);
                    throw error;
                }
            });
        },
        verifyEmail() {
            return __awaiter(this, void 0, void 0, function* () {
                const mailerTransport = this.broker.options.$settings.services.mailer.transport;
                try {
                    if (mailerTransport) {
                        yield mailerTransport.verify();
                    }
                }
                catch (error) {
                    // If error is detected during verification : we reset to retry later.
                    this.broker.options.$settings.services.mailer = {};
                }
            });
        },
    },
};
//# sourceMappingURL=mailer.mixin.js.map