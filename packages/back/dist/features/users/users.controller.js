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
exports.UsersController = void 0;
const NotFoundError_1 = require("@/lib/error/NotFoundError");
const lib_1 = require("@/lib");
const users_schema_1 = require("./users.schema");
const UsersController = {
    name: "controller.users",
    actions: {
        get: {
            openapi: users_schema_1.UsersSchema.get,
            params: {
                type: "object",
                required: ["id"],
                additionalProperties: false,
                properties: {
                    id: { type: "string" },
                },
            },
            handler(ctx) {
                return __awaiter(this, void 0, void 0, function* () {
                    this.initUserMe(ctx);
                    const { id } = ctx.params;
                    lib_1.PermissionsLib.validateAction("controller.users.get", ctx.meta.user, "User", { id });
                    const user = yield ctx.call("service.users.get", { id });
                    if (!user) {
                        throw new NotFoundError_1.NotFoundError("Cannot find user", { userId: id });
                    }
                    return user;
                });
            },
        },
        update: {
            openapi: users_schema_1.UsersSchema.update,
            params: users_schema_1.UsersSchema.userUpdateParam,
            handler(ctx) {
                return __awaiter(this, void 0, void 0, function* () {
                    this.initUserMe(ctx);
                    const userUpdate = ctx.params;
                    lib_1.PermissionsLib.validateAction("controller.users.update", ctx.meta.user, "User", { id: userUpdate.id });
                    const userUpdateInternal = Object.assign({}, userUpdate);
                    const userUpdated = yield ctx.call("service.users.update", userUpdateInternal);
                    return userUpdated;
                });
            },
        },
        // ! Route public
        validateEmail: {
            openapi: users_schema_1.UsersSchema.validateEmail,
            params: {
                type: "object",
                required: ["token"],
                properties: {
                    token: { type: "string" },
                },
            },
            handler: function (ctx) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { token } = ctx.params;
                    lib_1.PermissionsLib.validateAction("controller.users.validateEmail", undefined, "User");
                    return yield ctx.call("service.users.validateEmail", { token });
                });
            },
        },
    },
    methods: {
        initUserMe(ctx) {
            if (ctx.params.id === "me") {
                if (!ctx.meta.user.extended) {
                    throw new NotFoundError_1.NotFoundError("Cannot find user");
                }
                ctx.params.id = ctx.meta.user.extended.id;
            }
        },
    },
};
exports.UsersController = UsersController;
exports.default = UsersController;
//# sourceMappingURL=users.controller.js.map