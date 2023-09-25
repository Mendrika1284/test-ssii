"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamplesSchema = void 0;
var ExamplesSchema;
(function (ExamplesSchema) {
    const exampleSchema = {
        type: "object",
        required: ["id", "userId", "example", "createdAt", "updatedAt"],
        additionalProperties: false,
        properties: {
            id: { type: "string" },
            userId: { type: "string" },
            example: { type: "boolean" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
        },
    };
    ExamplesSchema.exampleParam = {
        type: "object",
        required: ["id", "userId", "example", "createdAt", "updatedAt"],
        additionalProperties: false,
        properties: {
            id: { type: "string" },
            userId: { type: "string" },
            example: { type: "boolean" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
        },
    };
    const exampleCreateSchema = {
        type: "object",
        required: ["example"],
        additionalProperties: false,
        properties: {
            example: { type: "boolean" },
        },
    };
    ExamplesSchema.exampleCreateParam = {
        type: "object",
        required: ["example"],
        additionalProperties: false,
        properties: {
            example: { type: "boolean" },
        },
    };
    ExamplesSchema.exampleCreateInternalParam = {
        type: "object",
        required: ["userId", "example"],
        additionalProperties: false,
        properties: {
            userId: { type: "string" },
            example: { type: "boolean" },
        },
    };
    const exampleUpdateSchema = {
        type: "object",
        required: ["id"],
        additionalProperties: false,
        properties: {
            id: { type: "string" },
            example: { type: "boolean", nullable: true },
        },
    };
    ExamplesSchema.exampleUpdateParam = {
        type: "object",
        required: ["id"],
        additionalProperties: false,
        properties: {
            id: { type: "string" },
            example: { type: "boolean", nullable: true },
        },
    };
    ExamplesSchema.exampleUpdateInternalParam = {
        type: "object",
        required: ["id"],
        additionalProperties: false,
        properties: {
            id: { type: "string" },
            userId: { type: "string", nullable: true },
            example: { type: "boolean", nullable: true },
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
    const queries = {
        userId: {
            description: "Id of a user",
            required: true,
            name: "userId",
            in: "query",
            schema: {
                type: "string",
            },
        },
    };
    const responseSchemas = {
        create: exampleSchema,
        list: { type: "array", items: exampleSchema },
        get: exampleSchema,
        update: exampleSchema,
        delete: { type: "boolean" },
    };
    ExamplesSchema.create = {
        summary: "Create an example",
        $path: "POST /api/v1/examples",
        tags: ["Example"],
        role: ["member", "support", "admin"],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        operationId: "controller.examples.create",
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: exampleCreateSchema,
                },
            },
        },
        responses: {
            200: {
                description: "The created example",
                content: {
                    "application/json": {
                        schema: responseSchemas.create,
                    },
                },
            },
        },
    };
    ExamplesSchema.list = {
        summary: "List examples",
        $path: "GET /api/v1/examples",
        tags: ["Example"],
        role: ["member", "support", "admin"],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        operationId: "controller.companies.examples.list",
        parameters: [queries.userId],
        responses: {
            200: {
                description: "List of examples",
                content: {
                    "application/json": {
                        schema: responseSchemas.list,
                    },
                },
            },
        },
    };
    ExamplesSchema.get = {
        summary: "Get an example",
        $path: "GET /api/v1/examples/{id}",
        tags: ["Example"],
        role: ["member", "support", "admin"],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        operationId: "controller.examples.get",
        parameters: [parameters.id],
        responses: {
            200: {
                description: "An example",
                content: {
                    "application/json": {
                        schema: responseSchemas.get,
                    },
                },
            },
        },
    };
    ExamplesSchema.update = {
        summary: "Update an example",
        $path: "PUT /api/v1/examples/{id}",
        tags: ["Example"],
        role: ["member", "support", "admin"],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        operationId: "controller.examples.update",
        parameters: [parameters.id],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: exampleUpdateSchema,
                },
            },
        },
        responses: {
            200: {
                description: "The updated example",
                content: {
                    "application/json": {
                        schema: responseSchemas.update,
                    },
                },
            },
        },
    };
    ExamplesSchema.remove = {
        summary: "Delete an example",
        $path: "DELETE /api/v1/examples/{id}",
        tags: ["Example"],
        role: ["member", "support", "admin"],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        operationId: "controller.examples.delete",
        parameters: [parameters.id],
        responses: {
            200: {
                description: "An boolean",
                content: {
                    "application/json": {
                        schema: responseSchemas.delete,
                    },
                },
            },
        },
    };
})(ExamplesSchema = exports.ExamplesSchema || (exports.ExamplesSchema = {}));
//# sourceMappingURL=examples.schema.js.map