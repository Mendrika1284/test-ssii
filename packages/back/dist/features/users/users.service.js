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
exports.UsersService = void 0;
const mixins_1 = require("@/mixins");
const api_1 = require("@edmp/api");
const crypto_1 = require("crypto");
const moleculer_1 = require("moleculer");
const users_repository_1 = require("./users.repository");
const error_1 = require("@/lib/error");
const users_schema_1 = require("./users.schema");
const NotFoundError_1 = require("@/lib/error/NotFoundError");
const UsersService = {
    name: "service.users",
    mixins: [mixins_1.MailerMixin],
    actions: {
        create: {
            params: users_schema_1.UsersSchema.userCreateParam,
            handler(ctx) {
                return __awaiter(this, void 0, void 0, function* () {
                    const userCreate = ctx.params;
                    let userCreateInternal = Object.assign({}, userCreate);
                    userCreateInternal = yield this.processEmail(ctx, { user: userCreateInternal });
                    return yield users_repository_1.UsersRepository.create(this, ctx, userCreateInternal);
                });
            },
        },
        list: {
            params: {
                type: "object",
                additionalProperties: false,
                properties: {
                    ids: { type: "array", items: { type: "string" }, nullable: true, minItems: 1 },
                    emailStatus: { type: "string", nullable: true, enum: ["invalid", "waiting", "pending", "confirmed"] },
                },
            },
            handler(ctx) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield users_repository_1.UsersRepository.list(this, ctx, ctx.params);
                });
            },
        },
        get: {
            params: {
                type: "object",
                required: [],
                additionalProperties: false,
                oneOf: [
                    {
                        required: ["id"],
                        properties: {
                            id: { type: "string" },
                        },
                    },
                    {
                        required: ["email"],
                        properties: {
                            email: { type: "string" },
                        },
                    },
                    {
                        required: ["emailVerifyToken"],
                        properties: {
                            emailVerifyToken: { type: "string" },
                        },
                    },
                ],
            },
            handler(ctx) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield users_repository_1.UsersRepository.get(this, ctx, ctx.params);
                });
            },
        },
        update: {
            params: users_schema_1.UsersSchema.userUpdateInternalServiceParam,
            handler(ctx) {
                return __awaiter(this, void 0, void 0, function* () {
                    const userUpdate = ctx.params;
                    let userUpdateInternal = Object.assign({}, userUpdate);
                    userUpdateInternal = yield this.processEmail(ctx, { user: userUpdateInternal });
                    return yield users_repository_1.UsersRepository.update(this, ctx, userUpdateInternal);
                });
            },
        },
        validateEmail: {
            params: {
                type: "object",
                required: ["token"],
                properties: {
                    token: { type: "string" },
                },
            },
            handler: function (ctx) {
                var _a;
                return __awaiter(this, void 0, void 0, function* () {
                    const { token } = ctx.params;
                    // Retrieve current User
                    const user = yield ctx.call("service.users.get", { emailVerifyToken: token });
                    if (!user) {
                        throw new error_1.ForbiddenError("Invalid Token", { action: (_a = ctx === null || ctx === void 0 ? void 0 : ctx.action) === null || _a === void 0 ? void 0 : _a.name });
                    }
                    const currentEmail = user.email;
                    const newEmail = user.newEmail;
                    if (!newEmail) {
                        throw new Error(`Invalid new mail for user Id : ${user.id}`);
                    }
                    // First, Update account (apply new email on current if doesn't exist )
                    const userAccount = yield ctx.call("service.users.get", { email: currentEmail });
                    if (!userAccount) {
                        throw new NotFoundError_1.NotFoundError("Cannot find user account", { email: currentEmail });
                    }
                    yield ctx.call("service.user-accounts.update", {
                        id: userAccount.id,
                        username: newEmail,
                    });
                    const userUpdateInternal = {
                        id: user.id,
                        email: newEmail,
                        emailStatus: "confirmed",
                        newEmail: undefined,
                        emailVerifyToken: undefined,
                        emailVerifyExpirationDate: undefined,
                    };
                    const userUpdated = yield users_repository_1.UsersRepository.update(this, ctx, userUpdateInternal);
                    return userUpdated;
                });
            },
        },
    },
    events: {
        "user.email.updated": {
            handler: function (ctx) {
                var _a;
                return __awaiter(this, void 0, void 0, function* () {
                    const { user } = ctx.params;
                    if (!user.emailVerifyToken) {
                        this.logger.info(`Missing email verify token`, { user });
                        return;
                    }
                    // We detect a pending status
                    if (user.emailStatus === "pending" && user.firstName && user.newEmail) {
                        try {
                            const sentMessageInfo = yield this.sendMail({
                                to: user.newEmail,
                                templateName: "user.email.update",
                                data: {
                                    mail: user.newEmail,
                                    firstName: user.firstName,
                                    token: user.emailVerifyToken,
                                    emailVerifyExpirationDate: (0, api_1.getMoment)(user.emailVerifyExpirationDate).format("DD/MM/YYYY"),
                                },
                            });
                            if ((_a = sentMessageInfo === null || sentMessageInfo === void 0 ? void 0 : sentMessageInfo.rejected) === null || _a === void 0 ? void 0 : _a.includes(user.newEmail)) {
                                // EMAIL is WRONG !
                                yield users_repository_1.UsersRepository.update(this, ctx, { id: user.id, emailStatus: "invalid" });
                            }
                        }
                        catch (error) {
                            // SHOULD ARLEADY BE TESTED IN MAILING SERVICE et remonter comme indicateur
                            this.logger.error(`Error when sending mail : ${error}`);
                        }
                    }
                });
            },
        },
    },
    methods: {
        processEmail(ctx, params) {
            return __awaiter(this, void 0, void 0, function* () {
                const { user } = params;
                if (user.newEmail) {
                    // Check if user try to modify with a new email who is already existing
                    const userGet = yield users_repository_1.UsersRepository.get(this, ctx, { email: user.newEmail });
                    if (userGet) {
                        // Check it is not user himself... who modify data
                        throw new moleculer_1.Errors.MoleculerError("Duplicate key", 409, "VALIDATION_ERROR");
                    }
                }
                // Check if email status is pending to prepare a token of validation
                if (user.emailStatus === "pending") {
                    user.emailVerifyToken = (0, crypto_1.randomBytes)(20).toString("hex");
                    const delayExpirationToken = this.broker.options.$settings.app.user.emailVerifyExpiration || 2;
                    user.emailVerifyExpirationDate = (0, api_1.getMoment)().add(delayExpirationToken, "hours").toISOString();
                }
                return user;
            });
        },
    },
};
exports.UsersService = UsersService;
exports.default = UsersService;
//# sourceMappingURL=users.service.js.map