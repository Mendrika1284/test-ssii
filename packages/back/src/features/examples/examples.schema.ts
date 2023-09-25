import { Example, ExampleUpdate, ExampleCreate, ExampleCreateInternal, ExampleUpdateInternal } from "@edmp/api";
import { JSONSchemaType } from "ajv";
import { OpenAPIV3 } from "openapi-types";

export namespace ExamplesSchema {
  const exampleSchema: OpenAPIV3.SchemaObject & JSONSchemaType<Example> = {
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
  export const exampleParam: JSONSchemaType<Example> = {
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

  const exampleCreateSchema: OpenAPIV3.SchemaObject & JSONSchemaType<ExampleCreate> = {
    type: "object",
    required: ["example"],
    additionalProperties: false,
    properties: {
      example: { type: "boolean" },
    },
  };
  export const exampleCreateParam: JSONSchemaType<ExampleCreate> = {
    type: "object",
    required: ["example"],
    additionalProperties: false,
    properties: {
      example: { type: "boolean" },
    },
  };
  export const exampleCreateInternalParam: JSONSchemaType<ExampleCreateInternal> = {
    type: "object",
    required: ["userId", "example"],
    additionalProperties: false,
    properties: {
      userId: { type: "string" },
      example: { type: "boolean" },
    },
  };

  const exampleUpdateSchema: OpenAPIV3.SchemaObject & JSONSchemaType<ExampleUpdate> = {
    type: "object",
    required: ["id"],
    additionalProperties: false,
    properties: {
      id: { type: "string" },
      example: { type: "boolean", nullable: true },
    },
  };
  export const exampleUpdateParam: JSONSchemaType<ExampleUpdate> = {
    type: "object",
    required: ["id"],
    additionalProperties: false,
    properties: {
      id: { type: "string" },
      example: { type: "boolean", nullable: true },
    },
  };
  export const exampleUpdateInternalParam: JSONSchemaType<ExampleUpdateInternal> = {
    type: "object",
    required: ["id"],
    additionalProperties: false,
    properties: {
      id: { type: "string" },
      userId: { type: "string", nullable: true },
      example: { type: "boolean", nullable: true },
    },
  };

  const parameters: {
    [key in "id"]: OpenAPIV3.ParameterObject;
  } = {
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

  const queries: {
    [key in "userId"]: OpenAPIV3.ParameterObject;
  } = {
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

  const responseSchemas: {
    [key in "create" | "list" | "get" | "update" | "delete"]: OpenAPIV3.SchemaObject;
  } = {
    create: exampleSchema,
    list: { type: "array", items: exampleSchema },
    get: exampleSchema,
    update: exampleSchema,
    delete: { type: "boolean" },
  };

  export const create: OpenAPIV3.OperationObject & { $path: string; role: string[] } = {
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

  export const list: OpenAPIV3.OperationObject & { $path: string; role: string[] } = {
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

  export const get: OpenAPIV3.OperationObject & { $path: string; role: string[] } = {
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

  export const update: OpenAPIV3.OperationObject & { $path: string; role: string[] } = {
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

  export const remove: OpenAPIV3.OperationObject & { $path: string; role: string[] } = {
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
}
