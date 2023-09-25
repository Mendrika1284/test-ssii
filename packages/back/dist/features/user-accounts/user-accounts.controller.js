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
exports.UserAccountsController = void 0;
const cookie_1 = __importDefault(require("cookie"));
const device_detector_js_1 = __importDefault(require("device-detector-js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moleculer_1 = require("moleculer");
const uuid_1 = require("uuid");
const NotFoundError_1 = require("@/lib/error/NotFoundError");
const lib_1 = require("@/lib");
const error_1 = require("@/lib/error");
const user_accounts_schema_1 = require("./user-accounts.schema");
const UserAccountsController = {
    name: "controller.user-accounts",
    settings: {},
    created() {
        this.settings = {
            jwtOptions: {
                expiresIn: this.broker.options.$settings.gateway.token.expiresIn,
                audience: this.broker.options.$settings.gateway.token.audience,
                issuer: this.broker.options.$settings.gateway.token.issuer,
            },
            cookieName: this.broker.options.$settings.gateway.token.cookieName || "ownily",
            cookieOptions: this.broker.options.$settings.gateway.cookie,
        };
        this.deviceDetector = new device_detector_js_1.default();
    },
    actions: {
        create: {
            // ! Route public
            openapi: user_accounts_schema_1.UserAccountsSchema.create,
            params: user_accounts_schema_1.UserAccountsSchema.userAccountCreateParam,
            handler(ctx) {
                return __awaiter(this, void 0, void 0, function* () {
                    lib_1.PermissionsLib.validateAction("controller.user-accounts.create", ctx.meta.user, "UserAccount");
                    const { username } = ctx.params;
                    const userAccountCreated = yield ctx.call("service.user-accounts.create", {
                        username,
                        scope: "member",
                    });
                    return userAccountCreated;
                });
            },
        },
        get: {
            openapi: user_accounts_schema_1.UserAccountsSchema.get,
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string" }, // `userAccount.id` or `userAccount.username`,
                },
            },
            handler(ctx) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { id } = ctx.params;
                    const params = (0, uuid_1.validate)(id) ? { id } : { username: id };
                    const userAccount = yield ctx.call("service.user-accounts.get", params);
                    if (!userAccount) {
                        throw new NotFoundError_1.NotFoundError("Cannot find user account", params);
                    }
                    lib_1.PermissionsLib.validateAction("controller.user-accounts.get", ctx.meta.user, "UserAccount", {
                        id: userAccount.id,
                    });
                    return userAccount;
                });
            },
        },
        update: {
            openapi: user_accounts_schema_1.UserAccountsSchema.update,
            params: user_accounts_schema_1.UserAccountsSchema.userAccountUpdateParam,
            handler(ctx) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { id, username } = ctx.params;
                    lib_1.PermissionsLib.validateAction("controller.user-accounts.update", ctx.meta.user, "UserAccount", { id });
                    const userAccountUpdated = yield ctx.call("service.user-accounts.update", { id, username });
                    return userAccountUpdated;
                });
            },
        },
        login: {
            // ! Route public
            openapi: user_accounts_schema_1.UserAccountsSchema.login,
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
                    if (!this.deviceDetector) {
                        throw new error_1.InternalServerError("deviceDetector not found", "USER_ACCOUNT_ERROR");
                    }
                    const device = this.deviceDetector.parse(ctx.meta.device);
                    const payload = yield ctx.call("service.user-accounts.verify", ctx.params);
                    if (!payload) {
                        this.cleanToken(ctx);
                        void ctx.emit("userAccount.login.failure", Object.assign(Object.assign({}, ctx.params), { device }));
                        throw new moleculer_1.Errors.MoleculerError("Authentication failed", 401);
                    }
                    lib_1.PermissionsLib.validateAction("controller.user-accounts.login", { id: payload.id, username: payload.username, scope: payload.scope }, "UserAccount");
                    const jwtToken = this.sendToken(ctx, payload);
                    void ctx.emit("userAccount.login.success", {
                        device,
                        payload,
                    });
                    return jwtToken;
                });
            },
        },
        "login.get": {
            openapi: user_accounts_schema_1.UserAccountsSchema.getLogin,
            // eslint-disable-next-line @typescript-eslint/require-await
            handler(ctx) {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = ctx.meta.user;
                    lib_1.PermissionsLib.validateAction("controller.user-accounts.login.get", ctx.meta.user, "UserAccount", {
                        id: user.id,
                    });
                    const payload = {
                        id: user.id,
                        username: user.username,
                        scope: user.scope,
                    };
                    return payload;
                });
            },
        },
        "login.renew": {
            openapi: user_accounts_schema_1.UserAccountsSchema.renewLogin,
            // eslint-disable-next-line @typescript-eslint/require-await
            handler(ctx) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!this.deviceDetector) {
                        throw new error_1.InternalServerError("deviceDetector not found", "USER_ACCOUNT_ERROR");
                    }
                    const { user } = ctx.meta;
                    lib_1.PermissionsLib.validateAction("controller.user-accounts.login.renew", ctx.meta.user, "UserAccount", {
                        id: user.id,
                    });
                    const device = this.deviceDetector.parse(ctx.meta.device);
                    const payload = {
                        id: user.id,
                        username: user.username,
                        scope: user.scope,
                    };
                    const jwtToken = this.sendToken(ctx, payload);
                    void ctx.emit("userAccount.login.success", {
                        device,
                        payload,
                    });
                    return jwtToken;
                });
            },
        },
        logout: {
            openapi: user_accounts_schema_1.UserAccountsSchema.logout,
            // eslint-disable-next-line @typescript-eslint/require-await
            handler(ctx) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { user } = ctx.meta;
                    lib_1.PermissionsLib.validateAction("controller.user-accounts.logout", ctx.meta.user, "UserAccount", { id: user.id });
                    const payload = {
                        id: user.id,
                        username: user.username,
                        scope: user.scope,
                    };
                    this.cleanToken(ctx);
                    void ctx.emit("userAccount.logout", payload);
                });
            },
        },
    },
    methods: {
        sendToken(ctx, payload) {
            // By security we filter payload
            const payloadToSign = {
                id: payload.id,
                username: payload.username,
                scope: payload.scope,
            };
            // Build token
            if (!this.settings.jwtOptions) {
                throw new error_1.InternalServerError("Cannot find `jwtOptions`", "USER_ACCOUNT_ERROR");
            }
            const newAccessToken = jsonwebtoken_1.default.sign(payloadToSign, this.broker.options.$settings.gateway.token.secret, this.settings.jwtOptions);
            // Set a cookie token and send the token back as well.
            if (!this.settings.cookieName) {
                throw new error_1.InternalServerError("Cannot find `cookieName`", "USER_ACCOUNT_ERROR");
            }
            if (!this.settings.cookieOptions) {
                throw new error_1.InternalServerError("Cannot find `cookieOptions`", "USER_ACCOUNT_ERROR");
            }
            const setCookie = cookie_1.default.serialize(this.settings.cookieName, newAccessToken, this.settings.cookieOptions);
            ctx.meta.$responseHeaders = {
                "Set-Cookie": setCookie,
            };
            const jwtToken = {
                id_token: newAccessToken,
                token_type: "Bearer",
            };
            return jwtToken;
        },
        cleanToken(ctx) {
            if (!this.settings.cookieName) {
                throw new error_1.InternalServerError("Cannot find `cookieName`", "USER_ACCOUNT_ERROR");
            }
            if (!this.settings.cookieOptions) {
                throw new error_1.InternalServerError("Cannot find `cookieOptions`", "USER_ACCOUNT_ERROR");
            }
            // Clean cookie if it exist
            const setCookie = cookie_1.default.serialize(this.settings.cookieName, "", this.settings.cookieOptions);
            ctx.meta.$responseHeaders = {
                "Set-Cookie": setCookie,
            };
        },
    },
};
exports.UserAccountsController = UserAccountsController;
exports.default = UserAccountsController;
//# sourceMappingURL=user-accounts.controller.js.map