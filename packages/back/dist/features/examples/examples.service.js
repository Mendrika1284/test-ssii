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
exports.ExamplesService = void 0;
const mixins_1 = require("@/mixins");
const examples_schema_1 = require("./examples.schema");
const examples_repository_1 = require("./examples.repository");
const ExamplesService = {
    name: "service.examples",
    mixins: [mixins_1.MailerMixin],
    actions: {
        create: {
            summary: "Create example of a company",
            params: examples_schema_1.ExamplesSchema.exampleCreateInternalParam,
            handler(ctx) {
                return __awaiter(this, void 0, void 0, function* () {
                    const exampleCreated = yield examples_repository_1.ExamplesRepository.create(this, ctx, ctx.params);
                    return exampleCreated;
                });
            },
        },
        list: {
            summary: "Get list of example for a company",
            params: {
                type: "object",
                additionalProperties: false,
                properties: {
                    userId: { type: "string", nullable: true },
                },
            },
            handler(ctx) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield examples_repository_1.ExamplesRepository.list(this, ctx, ctx.params);
                });
            },
        },
        get: {
            summary: "Get example by id",
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
                    return yield examples_repository_1.ExamplesRepository.get(this, ctx, ctx.params);
                });
            },
        },
        update: {
            summary: "Update example of a company",
            params: examples_schema_1.ExamplesSchema.exampleUpdateInternalParam,
            handler(ctx) {
                return __awaiter(this, void 0, void 0, function* () {
                    const exampleUpdated = yield examples_repository_1.ExamplesRepository.update(this, ctx, ctx.params);
                    return exampleUpdated;
                });
            },
        },
        delete: {
            summary: "Delete example of a company",
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
                    return yield examples_repository_1.ExamplesRepository.remove(this, ctx, ctx.params);
                });
            },
        },
    },
};
exports.ExamplesService = ExamplesService;
exports.default = ExamplesService;
//# sourceMappingURL=examples.service.js.map