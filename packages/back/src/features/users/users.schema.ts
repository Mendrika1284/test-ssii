import { User, UserUpdate, UserCreate, UserCreateInternal, UserUpdateInternalService, UsersService } from "@edmp/api";
import { JSONSchemaType } from "ajv";
import { OpenAPIV3 } from "openapi-types";

export namespace UsersSchema {
  const userSchema: OpenAPIV3.SchemaObject & JSONSchemaType<User> = {
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
  export const userParam: JSONSchemaType<User> = {
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

  const userCreateSchema: OpenAPIV3.SchemaObject & JSONSchemaType<UserCreate> = {
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
  export const userCreateParam: JSONSchemaType<UserCreate> = {
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
  export const userCreateInternalParam: JSONSchemaType<UserCreateInternal> = {
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

  const userUpdateSchema: OpenAPIV3.SchemaObject & JSONSchemaType<UserUpdate> = {
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
  export const userUpdateParam: JSONSchemaType<UserUpdate> = {
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
  export const userUpdateInternalServiceParam: JSONSchemaType<UserUpdateInternalService> = {
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

  const responseSchemas: {
    [key in "get" | "update" | "validateEmail"]: OpenAPIV3.SchemaObject;
  } = {
    get: userSchema,
    update: userSchema,
    validateEmail: userSchema,
  };

  export const get: OpenAPIV3.OperationObject & { $path: string; role: string[] } = {
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

  export const update: OpenAPIV3.OperationObject & { $path: string; role: string[] } = {
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
  export const validateEmail: OpenAPIV3.OperationObject & { $path: string; role: string[] } = {
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
}
