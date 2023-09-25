import {
  UserAccount,
  UserAccountCreate,
  UserAccountCreateInternal,
  UserAccountUpdate,
  UserAccountUpdateInternal,
  UserAccountsService,
  JwtToken,
} from "@edmp/api";
import { JSONSchemaType } from "ajv";
import { OpenAPIV3 } from "openapi-types";

export namespace UserAccountsSchema {
  const userAccountSchema: OpenAPIV3.SchemaObject & JSONSchemaType<UserAccount> = {
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
  export const userAccountParam: JSONSchemaType<UserAccount> = {
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

  const userAccountCreateSchema: OpenAPIV3.SchemaObject & JSONSchemaType<UserAccountCreate> = {
    type: "object",
    required: ["username"],
    additionalProperties: false,
    properties: {
      username: { type: "string" },
    },
  };
  export const userAccountCreateParam: JSONSchemaType<UserAccountCreate> = {
    type: "object",
    required: ["username"],
    additionalProperties: false,
    properties: {
      username: { type: "string" },
    },
  };
  export const userAccountCreateInternalParam: JSONSchemaType<UserAccountCreateInternal> = {
    type: "object",
    required: ["username", "scope"],
    additionalProperties: false,
    properties: {
      username: { type: "string" },
      scope: { type: "string", enum: ["anonymous", "member", "support", "admin", "system"] },
    },
  };

  const userAccountUpdateSchema: OpenAPIV3.SchemaObject & JSONSchemaType<UserAccountUpdate> = {
    type: "object",
    required: ["id"],
    additionalProperties: false,
    properties: {
      id: { type: "string" },
      username: { type: "string", nullable: true },
    },
  };
  export const userAccountUpdateParam: JSONSchemaType<UserAccountUpdate> = {
    type: "object",
    required: ["id"],
    additionalProperties: false,
    properties: {
      id: { type: "string" },
      username: { type: "string", nullable: true },
    },
  };
  export const userAccountUpdateInternalParam: JSONSchemaType<UserAccountUpdateInternal> = {
    type: "object",
    required: ["id"],
    additionalProperties: false,
    properties: {
      id: { type: "string" },
      username: { type: "string", nullable: true },
      scope: { type: "string", nullable: true, enum: ["anonymous", "member", "support", "admin", "system"] },
    },
  };

  const jwtTokenSchema: OpenAPIV3.SchemaObject & JSONSchemaType<JwtToken> = {
    type: "object",
    required: ["id_token", "token_type"],
    additionalProperties: false,
    properties: {
      id_token: { type: "string" },
      token_type: { type: "string" },
    },
  };

  const parameters: {
    [key in "id" | "idOrUsername"]: OpenAPIV3.ParameterObject;
  } = {
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

  const requestBodies: {
    create: OpenAPIV3.SchemaObject & JSONSchemaType<UserAccountsService.CreateIn>;
    update: OpenAPIV3.SchemaObject & JSONSchemaType<UserAccountsService.UpdateIn>;
    login: OpenAPIV3.SchemaObject & JSONSchemaType<UserAccountsService.LoginIn>;
    renewLogin: OpenAPIV3.SchemaObject & JSONSchemaType<UserAccountsService.RenewLoginIn>;
    logout: OpenAPIV3.SchemaObject & JSONSchemaType<UserAccountsService.LogoutIn>;
  } = {
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
    } as OpenAPIV3.SchemaObject & JSONSchemaType<UserAccountsService.LoginIn>,
    renewLogin: {} as OpenAPIV3.SchemaObject & JSONSchemaType<UserAccountsService.RenewLoginIn>,
    logout: {} as OpenAPIV3.SchemaObject & JSONSchemaType<UserAccountsService.LogoutIn>,
  };

  const responseSchemas: {
    create: OpenAPIV3.SchemaObject & JSONSchemaType<UserAccountsService.CreateOut>;
    get: OpenAPIV3.SchemaObject & JSONSchemaType<UserAccountsService.GetOut>;
    update: OpenAPIV3.SchemaObject & JSONSchemaType<UserAccountsService.UpdateOut>;
    login: OpenAPIV3.SchemaObject & JSONSchemaType<UserAccountsService.LoginOut>;
    getLogin: OpenAPIV3.SchemaObject & JSONSchemaType<UserAccountsService.GetLoginOut>;
    renewLogin: OpenAPIV3.SchemaObject & JSONSchemaType<UserAccountsService.RenewLoginOut>;
    logout: OpenAPIV3.SchemaObject & JSONSchemaType<UserAccountsService.LogoutOut>;
  } = {
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
    logout: {} as OpenAPIV3.SchemaObject & JSONSchemaType<UserAccountsService.LogoutOut>,
  };

  // ! Route public
  export const create: OpenAPIV3.OperationObject & { $path: string; role: string[] } = {
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

  export const get: OpenAPIV3.OperationObject & { $path: string; role: string[] } = {
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

  export const update: OpenAPIV3.OperationObject & { $path: string; role: string[] } = {
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
  export const login: OpenAPIV3.OperationObject & { $path: string; role: string[] } = {
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

  export const getLogin: OpenAPIV3.OperationObject & { $path: string; role: string[] } = {
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

  export const renewLogin: OpenAPIV3.OperationObject & { $path: string; role: string[] } = {
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

  export const logout: OpenAPIV3.OperationObject & { $path: string; role: string[] } = {
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
}
