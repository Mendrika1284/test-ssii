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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAccountsService = void 0;
const mixins_1 = require("@/mixins");
const moleculer_1 = require("moleculer");
const user_accounts_repository_1 = require("./user-accounts.repository");
const user_accounts_schema_1 = require("./user-accounts.schema");
const UserAccountsService = {
    name: "service.user-accounts",
    mixins: [mixins_1.MailerMixin],
    actions: {
        create: {
            summary: "Create user account",
            params: user_accounts_schema_1.UserAccountsSchema.userAccountCreateInternalParam,
            handler(ctx) {
                return __awaiter(this, void 0, void 0, function* () {
                    const userAccountCreateInternal = ctx.params;
                    // Create user account
                    const userAccount = yield ctx.call("service.user-accounts.get", {
                        username: userAccountCreateInternal.username,
                    });
                    if (userAccount) {
                        throw new moleculer_1.Errors.MoleculerError("Duplicate key", 409, "VALIDATION_ERROR");
                    }
                    const userAccountCreated = yield user_accounts_repository_1.UserAccountsRepository.create(this, ctx, userAccountCreateInternal);
                    // Add user in Meta to identify user in Ctx (emit, log, APM ...)
                    ctx.meta.user = {
                        id: userAccountCreated.id,
                        username: userAccountCreated.username,
                        scope: userAccountCreated.scope,
                    };
                    if (userAccountCreated.scope === "member") {
                        yield ctx.call("service.users.create", {
                            email: userAccountCreated.username,
                            emailStatus: "pending",
                            newEmail: userAccountCreated.username,
                            firstName: "",
                            lastName: "",
                            optinMarket: false,
                        });
                    }
                    return userAccountCreated;
                });
            },
        },
        get: {
            summary: "Get user account with sub",
            params: {
                type: "object",
                required: [],
                additionalProperties: false,
                properties: {
                    id: { type: "string" },
                    username: { type: "string" },
                },
                oneOf: [{ required: ["id"] }, { required: ["username"] }],
            },
            handler(ctx) {
                return __awaiter(this, void 0, void 0, function* () {
                    const userAccount = yield user_accounts_repository_1.UserAccountsRepository.get(this, ctx, ctx.params);
                    return userAccount;
                });
            },
        },
        update: {
            params: user_accounts_schema_1.UserAccountsSchema.userAccountUpdateInternalParam,
            handler(ctx) {
                return __awaiter(this, void 0, void 0, function* () {
                    const userAccountUpdated = yield user_accounts_repository_1.UserAccountsRepository.update(this, ctx, ctx.params);
                    return userAccountUpdated;
                });
            },
        },
        verify: {
            summary: "Verify user account",
            params: {
                type: "object",
                required: [],
                additionalProperties: false,
                properties: {
                    id: { type: "string" },
                    username: { type: "string" },
                },
                oneOf: [{ required: ["id"] }, { required: ["username"] }],
            },
            handler(ctx) {
                return __awaiter(this, void 0, void 0, function* () {
                    let payload;
                    const userAccount = yield ctx.call("service.user-accounts.get", ctx.params);
                    if (userAccount) {
                        payload = {
                            id: userAccount.id,
                            username: userAccount.username,
                            scope: userAccount.scope,
                        };
                    }
                    return payload;
                });
            },
        },
    },
    events: {
        "repository.connected": {
            handler: function (ctx) {
                return __awaiter(this, void 0, void 0, function* () {
                    this.logger.info(`The collection 'UserAccount' is empty. Seeding admin accounts`);
                    const adminUserAccounts = this.broker.options.$settings.app.adminUsers;
                    this.logger.trace(`Seed collection UserAccount: `, adminUserAccounts);
                    for (const adminAccount of adminUserAccounts) {
                        try {
                            // We use username to init a SUB for ADMIN (there is no User)
                            yield ctx.call("service.user-accounts.create", adminAccount);
                            // await this.createOrUpdate(userAccount.username, userAccount);
                        }
                        catch (error) {
                            this.logger.error("seedDB error", { error });
                        }
                    }
                    this.logger.info("Seeding is done.");
                });
            },
        },
    },
};
exports.UserAccountsService = UserAccountsService;
exports.default = UserAccountsService;
//# sourceMappingURL=user-accounts.service.js.map