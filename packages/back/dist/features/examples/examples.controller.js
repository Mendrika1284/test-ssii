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
exports.ExamplesController = void 0;
const NotFoundError_1 = require("@/lib/error/NotFoundError");
const examples_schema_1 = require("./examples.schema");
const lib_1 = require("@/lib");
const ExamplesController = {
    name: "controller.examples",
    actions: {
        create: {
            summary: "Create an example",
            openapi: examples_schema_1.ExamplesSchema.create,
            params: examples_schema_1.ExamplesSchema.exampleCreateParam,
            handler(ctx) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { user } = ctx.meta;
                    if (!user.extended) {
                        throw new NotFoundError_1.NotFoundError("Cannot find user");
                    }
                    const exampleCreate = ctx.params;
                    const exampleCreateInternal = Object.assign(Object.assign({}, exampleCreate), { userId: user.extended.id });
                    lib_1.PermissionsLib.validateAction("controller.examples.create", user, "User", { id: exampleCreateInternal.userId });
                    const exampleCreated = yield ctx.call("service.examples.create", exampleCreateInternal);
                    return exampleCreated;
                });
            },
        },
        list: {
            summary: "List examples",
            openapi: examples_schema_1.ExamplesSchema.list,
            params: {
                type: "object",
                required: ["userId"],
                additionalProperties: false,
                properties: {
                    userId: { type: "string" },
                },
            },
            handler(ctx) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { user } = ctx.meta;
                    const examples = yield ctx.call("service.examples.list", ctx.params);
                    for (const example of examples) {
                        lib_1.PermissionsLib.validateAction("controller.examples.list", user, "User", { id: example.userId });
                    }
                    return examples;
                });
            },
        },
        get: {
            summary: "Retrieve an example",
            openapi: examples_schema_1.ExamplesSchema.get,
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
                    const { user } = ctx.meta;
                    const { id } = ctx.params;
                    const example = yield ctx.call("service.examples.get", { id });
                    if (!example) {
                        throw new NotFoundError_1.NotFoundError("Cannot find example", { exampleId: id });
                    }
                    lib_1.PermissionsLib.validateAction("controller.examples.get", user, "User", { id: example.userId });
                    return example;
                });
            },
        },
        update: {
            summary: "Update an example",
            openapi: examples_schema_1.ExamplesSchema.update,
            params: examples_schema_1.ExamplesSchema.exampleUpdateParam,
            handler(ctx) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { user } = ctx.meta;
                    if (!user.extended) {
                        throw new NotFoundError_1.NotFoundError("Cannot find user");
                    }
                    const exampleUpdate = ctx.params;
                    const exampleUpdateInternal = Object.assign(Object.assign({}, exampleUpdate), { userId: user.extended.id });
                    lib_1.PermissionsLib.validateAction("controller.examples.update", user, "User", { id: exampleUpdateInternal.userId });
                    const exampleUpdated = ctx.call("service.examples.update", exampleUpdateInternal);
                    return exampleUpdated;
                });
            },
        },
        delete: {
            summary: "Delete an example",
            openapi: examples_schema_1.ExamplesSchema.remove,
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
                    const { user } = ctx.meta;
                    const { id } = ctx.params;
                    const example = yield ctx.call("service.examples.get", { id });
                    if (!example) {
                        throw new NotFoundError_1.NotFoundError("Cannot find example", { exampleId: id });
                    }
                    lib_1.PermissionsLib.validateAction("controller.examples.delete", user, "User", { id: example.userId });
                    const exampleDeleted = ctx.call("service.examples.delete", ctx.params);
                    return exampleDeleted;
                });
            },
        },
    },
};
exports.ExamplesController = ExamplesController;
exports.default = ExamplesController;
//# sourceMappingURL=examples.controller.js.map