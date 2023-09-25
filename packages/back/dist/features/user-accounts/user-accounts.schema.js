"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAccountsSchema = void 0;
var UserAccountsSchema;
(function (UserAccountsSchema) {
    const userAccountSchema = {
        type: "object",
        required: ["id", "username", "scope", "createdAt", "updatedAt"],
        additionalProperties: false,
        properties: {
            id: { type: "string" },
            username: { type: "string" },
            scope: { type: "string", enum: ["anonymous", "member", "support", "admin", "system"] },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
        },
    };
    UserAccountsSchema.userAccountParam = {
        type: "object",
        required: ["id", "username", "scope", "createdAt", "updatedAt"],
        additionalProperties: false,
        properties: {
            id: { type: "string" },
            username: { type: "string" },
            scope: { type: "string", enum: ["anonymous", "member", "support", "admin", "system"] },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
        },
    };
    const userAccountCreateSchema = {
        type: "object",
        required: ["username"],
        additionalProperties: false,
        properties: {
            username: { type: "string" },
        },
    };
    UserAccountsSchema.userAccountCreateParam = {
        type: "object",
        required: ["username"],
        additionalProperties: false,
        properties: {
            username: { type: "string" },
        },
    };
    UserAccountsSchema.userAccountCreateInternalParam = {
        type: "object",
        required: ["username", "scope"],
        additionalProperties: false,
        properties: {
            username: { type: "string" },
            scope: { type: "string", enum: ["anonymous", "member", "support", "admin", "system"] },
        },
    };
    const userAccountUpdateSchema = {
        type: "object",
        required: ["id"],
        additionalProperties: false,
        properties: {
            id: { type: "string" },
            username: { type: "string", nullable: true },
        },
    };
    UserAccountsSchema.userAccountUpdateParam = {
        type: "object",
        required: ["id"],
        additionalProperties: false,
        properties: {
            id: { type: "string" },
            username: { type: "string", nullable: true },
        },
    };
    UserAccountsSchema.userAccountUpdateInternalParam = {
        type: "object",
        required: ["id"],
        additionalProperties: false,
        properties: {
            id: { type: "string" },
            username: { type: "string", nullable: true },
            scope: { type: "string", nullable: true, enum: ["anonymous", "member", "support", "admin", "system"] },
        },
    };
    const jwtTokenSchema = {
        type: "object",
        required: ["id_token", "token_type"],
        additionalProperties: false,
        properties: {
            id_token: { type: "string" },
            token_type: { type: "string" },
        },
    };
    const parameters = {
        id: {
            description: "Id of a user account",
            required: true,
            name: "id",
            in: "path",
            schema: {
                type: "string",
            },
        },
        idOrUsername: {
            description: "Id or username of a user account",
            required: true,
            name: "id",
            in: "path",
            schema: {
                type: "string",
            },
        },
    };
    const requestBodies = {
        create: userAccountCreateSchema,
        update: userAccountUpdateSchema,
        login: {
            type: "object",
            required: [],
            oneOf: [
                {
                    required: ["id"],
                    additionalProperties: false,
                    properties: {
                        id: { type: "string" },
                    },
                },
                {
                    required: ["username"],
                    additionalProperties: false,
                    properties: {
                        username: { type: "string" },
                    },
                },
            ],
        },
        renewLogin: {},
        logout: {},
    };
    const responseSchemas = {
        create: userAccountSchema,
        get: userAccountSchema,
        update: userAccountSchema,
        login: jwtTokenSchema,
        getLogin: {
            type: "object",
            required: ["id", "username", "scope"],
            additionalProperties: false,
            properties: {
                id: { type: "string" },
                username: { type: "string" },
                scope: { type: "string" },
            },
        },
        renewLogin: jwtTokenSchema,
        logout: {},
    };
    // ! Route public
    UserAccountsSchema.create = {
        summary: "Create an user account",
        $path: "POST /api/v1/user-accounts",
        tags: ["UserAccount"],
        role: ["anonymous", "member", "support", "admin"],
        operationId: "controller.user-accounts.create",
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: requestBodies.create,
                },
            },
        },
        responses: {
            200: {
                description: "The created user account",
                content: {
                    "application/json": {
                        schema: responseSchemas.create,
                    },
                },
            },
        },
    };
    UserAccountsSchema.get = {
        summary: "Get an user account",
        $path: "GET /api/v1/user-accounts/{id}",
        tags: ["UserAccount"],
        role: ["member", "support", "admin"],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        operationId: "controller.user-accounts.get",
        parameters: [parameters.idOrUsername],
        responses: {
            200: {
                description: "The user account",
                content: {
                    "application/json": {
                        schema: responseSchemas.get,
                    },
                },
            },
        },
    };
    UserAccountsSchema.update = {
        summary: "Update an user account",
        $path: "PUT /api/v1/user-accounts/{id}",
        tags: ["UserAccount"],
        role: ["member", "support", "admin"],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        operationId: "controller.user-accounts.update",
        parameters: [parameters.id],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: requestBodies.update,
                },
            },
        },
        responses: {
            200: {
                description: "The updated user account",
                content: {
                    "application/json": {
                        schema: responseSchemas.update,
                    },
                },
            },
        },
    };
    // ! Route public
    UserAccountsSchema.login = {
        summary: "Login an user account",
        description: "Set an cookie with jwt token",
        $path: "POST /meta/v1/login",
        tags: ["Meta", "UserAccount"],
        role: ["anonymous", "member", "support", "admin"],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        operationId: "controller.user-accounts.login",
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: requestBodies.login,
                },
            },
        },
        responses: {
            200: {
                description: "The the jwt token",
                content: {
                    "application/json": {
                        schema: responseSchemas.login,
                    },
                },
            },
        },
    };
    UserAccountsSchema.getLogin = {
        summary: "Get payload of the user account connected",
        $path: "GET /meta/v1/login",
        tags: ["Meta", "UserAccount"],
        role: ["member", "support", "admin"],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        operationId: "controller.user-accounts.login.get",
        responses: {
            200: {
                description: "The payload of the user account connected",
                content: {
                    "application/json": {
                        schema: responseSchemas.getLogin,
                    },
                },
            },
        },
    };
    UserAccountsSchema.renewLogin = {
        summary: "Renew jwt token of an user account connected",
        description: "Set an cookie with jwt token",
        $path: "POST /meta/v1/renew",
        tags: ["Meta", "UserAccount"],
        role: ["member", "support", "admin"],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        operationId: "controller.user-accounts.login.renew",
        responses: {
            200: {
                description: "The the jwt token",
                content: {
                    "application/json": {
                        schema: responseSchemas.login,
                    },
                },
            },
        },
    };
    UserAccountsSchema.logout = {
        summary: "Logout an user account",
        description: "Delete cookie",
        $path: "POST /meta/v1/logout",
        tags: ["Meta", "UserAccount"],
        role: ["member", "support", "admin"],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        operationId: "controller.user-accounts.login",
        responses: {
            200: {
                description: "",
                content: {
                    "application/json": {
                        schema: responseSchemas.logout,
                    },
                },
            },
        },
    };
})(UserAccountsSchema = exports.UserAccountsSchema || (exports.UserAccountsSchema = {}));
//# sourceMappingURL=user-accounts.schema.js.map