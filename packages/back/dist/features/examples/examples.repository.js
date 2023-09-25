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
exports.ExamplesRepository = void 0;
const api_1 = require("@edmp/api");
const lib_1 = require("@/lib");
var ExamplesRepository;
(function (ExamplesRepository) {
    ExamplesRepository.create = (service, ctx, params) => __awaiter(this, void 0, void 0, function* () {
        const doc = yield api_1.ExampleModel.create(params);
        const exampleCreated = lib_1.RepositoryLib.transformDocuments(doc);
        void ctx.emit("example.created", { example: exampleCreated, params });
        return exampleCreated;
    });
    ExamplesRepository.list = (service, ctx, params) => __awaiter(this, void 0, void 0, function* () {
        const docs = yield api_1.ExampleModel.find(params);
        const examples = lib_1.RepositoryLib.transformDocuments(docs);
        return examples;
    });
    ExamplesRepository.get = (service, ctx, params) => __awaiter(this, void 0, void 0, function* () {
        const { id } = params;
        const doc = yield api_1.ExampleModel.findById(id);
        const example = lib_1.RepositoryLib.transformDocuments(doc);
        return example;
    });
    ExamplesRepository.update = (service, ctx, params) => __awaiter(this, void 0, void 0, function* () {
        const doc = yield api_1.ExampleModel.findByIdAndUpdate(params.id, {
            $set: params,
        }, {
            upsert: true,
            new: true,
        });
        const exampleUpdated = lib_1.RepositoryLib.transformDocuments(doc);
        void ctx.emit("example.updated", { example: exampleUpdated, params });
        return exampleUpdated;
    });
    ExamplesRepository.remove = (service, ctx, params) => __awaiter(this, void 0, void 0, function* () {
        const { id } = params;
        const doc = yield api_1.ExampleModel.findByIdAndDelete(id);
        const exampleDeleted = lib_1.RepositoryLib.transformDocuments(doc);
        if (exampleDeleted) {
            void ctx.emit("example.deleted", { example: exampleDeleted, params: ctx.params });
        }
        return !!exampleDeleted;
    });
})(ExamplesRepository = exports.ExamplesRepository || (exports.ExamplesRepository = {}));
//# sourceMappingURL=examples.repository.js.map