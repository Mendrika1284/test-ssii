"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersSchema = void 0;
var UsersSchema;
(function (UsersSchema) {
    const userSchema = {
        type: "object",
        required: ["id", "firstName", "lastName", "email", "emailStatus", "createdAt", "updatedAt"],
        additionalProperties: false,
        properties: {
            id: { type: "string" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string" },
            emailStatus: { type: "string", enum: ["invalid", "waiting", "pending", "confirmed"] },
            emailVerifyToken: { type: "string", nullable: true },
            emailVerifyExpirationDate: { type: "string", nullable: true },
            newEmail: { type: "string", nullable: true },
            phone: { type: "string", nullable: true },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
        },
    };
    UsersSchema.userParam = {
        type: "object",
        required: ["id", "firstName", "lastName", "email", "emailStatus", "createdAt", "updatedAt"],
        additionalProperties: false,
        properties: {
            id: { type: "string" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string" },
            emailStatus: { type: "string", enum: ["invalid", "waiting", "pending", "confirmed"] },
            emailVerifyToken: { type: "string", nullable: true },
            emailVerifyExpirationDate: { type: "string", nullable: true },
            newEmail: { type: "string", nullable: true },
            phone: { type: "string", nullable: true },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
        },
    };
    const userCreateSchema = {
        type: "object",
        required: ["firstName", "lastName", "email", "emailStatus"],
        additionalProperties: false,
        properties: {
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string" },
            emailStatus: { type: "string", enum: ["invalid", "waiting", "pending", "confirmed"] },
            newEmail: { type: "string", nullable: true },
            phone: { type: "string", nullable: true },
        },
    };
    UsersSchema.userCreateParam = {
        type: "object",
        required: ["firstName", "lastName", "email", "emailStatus"],
        additionalProperties: false,
        properties: {
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string" },
            emailStatus: { type: "string", enum: ["invalid", "waiting", "pending", "confirmed"] },
            newEmail: { type: "string", nullable: true },
            phone: { type: "string", nullable: true },
        },
    };
    UsersSchema.userCreateInternalParam = {
        type: "object",
        required: ["firstName", "lastName", "email", "emailStatus"],
        additionalProperties: false,
        properties: {
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string" },
            emailStatus: { type: "string", enum: ["invalid", "waiting", "pending", "confirmed"] },
            emailVerifyToken: { type: "string", nullable: true },
            emailVerifyExpirationDate: { type: "string", nullable: true },
            newEmail: { type: "string", nullable: true },
            phone: { type: "string", nullable: true },
        },
    };
    const userUpdateSchema = {
        type: "object",
        required: ["id"],
        additionalProperties: false,
        properties: {
            id: { type: "string" },
            firstName: { type: "string", nullable: true },
            lastName: { type: "string", nullable: true },
            email: { type: "string", nullable: true },
            emailStatus: { type: "string", nullable: true, enum: ["invalid", "waiting", "pending", "confirmed"] },
            newEmail: { type: "string", nullable: true },
            phone: { type: "string", nullable: true },
        },
    };
    UsersSchema.userUpdateParam = {
        type: "object",
        required: ["id"],
        additionalProperties: false,
        properties: {
            id: { type: "string" },
            firstName: { type: "string", nullable: true },
            lastName: { type: "string", nullable: true },
            email: { type: "string", nullable: true },
            emailStatus: { type: "string", nullable: true, enum: ["invalid", "waiting", "pending", "confirmed"] },
            newEmail: { type: "string", nullable: true },
            phone: { type: "string", nullable: true },
        },
    };
    UsersSchema.userUpdateInternalServiceParam = {
        type: "object",
        required: ["id"],
        additionalProperties: false,
        properties: {
            id: { type: "string" },
            firstName: { type: "string", nullable: true },
            lastName: { type: "string", nullable: true },
            email: { type: "string", nullable: true },
            emailStatus: { type: "string", nullable: true, enum: ["invalid", "waiting", "pending", "confirmed"] },
            newEmail: { type: "string", nullable: true },
            phone: { type: "string", nullable: true },
        },
    };
    const parameters = {
        id: {
            description: "Id of a example",
            required: true,
            name: "id",
            in: "path",
            schema: {
                type: "string",
            },
        },
    };
    const responseSchemas = {
        get: userSchema,
        update: userSchema,
        validateEmail: userSchema,
    };
    UsersSchema.get = {
        summary: "Get an user",
        $path: "GET /api/v1/users/{id}",
        tags: ["User"],
        role: ["member", "support", "admin"],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        operationId: "controller.users.get",
        parameters: [parameters.id],
        responses: {
            200: {
                description: "An user",
                content: {
                    "application/json": {
                        schema: responseSchemas.get,
                    },
                },
            },
        },
    };
    UsersSchema.update = {
        summary: "Update an user",
        $path: "PUT /api/v1/users/{id}",
        tags: ["User"],
        role: ["member", "support", "admin"],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        operationId: "controller.users.update",
        parameters: [parameters.id],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: userUpdateSchema,
                },
            },
        },
        responses: {
            200: {
                description: "The updated user",
                content: {
                    "application/json": {
                        schema: responseSchemas.update,
                    },
                },
            },
        },
    };
    // ! Route public
    UsersSchema.validateEmail = {
        summary: "Validate an user email",
        $path: "POST /api/v1/users/validate-email",
        tags: ["User"],
        role: ["member", "support", "admin"],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        operationId: "controller.users.validateEmail",
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: ["token"],
                        additionalProperties: false,
                        properties: {
                            token: {
                                type: "string",
                                description: `A token to update user email status`,
                            },
                        },
                    },
                },
            },
        },
        responses: {
            200: {
                description: "The created user",
                content: {
                    "application/json": {
                        schema: responseSchemas.validateEmail,
                    },
                },
            },
        },
    };
})(UsersSchema = exports.UsersSchema || (exports.UsersSchema = {}));
//# sourceMappingURL=users.schema.js.map