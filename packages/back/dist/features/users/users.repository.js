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
exports.UsersRepository = void 0;
const api_1 = require("@edmp/api");
const lib_1 = require("@/lib");
var UsersRepository;
(function (UsersRepository) {
    UsersRepository.create = (service, ctx, params) => __awaiter(this, void 0, void 0, function* () {
        const doc = yield api_1.UserModel.create(params);
        const userCreated = lib_1.RepositoryLib.transformDocuments(doc);
        void ctx.emit("user.created", { user: userCreated, params });
        if (userCreated.emailStatus === "pending") {
            void ctx.emit("user.email.updated", { user: userCreated, params });
        }
        return userCreated;
    });
    UsersRepository.list = (service, ctx, params) => __awaiter(this, void 0, void 0, function* () {
        const { ids, emailStatus } = params;
        const filter = {};
        if (ids) {
            filter.id = { $in: ids };
        }
        if (emailStatus) {
            filter.emailStatus = emailStatus;
        }
        const docs = yield api_1.UserModel.find(filter);
        const users = lib_1.RepositoryLib.transformDocuments(docs);
        return users;
    });
    UsersRepository.get = (service, ctx, params) => __awaiter(this, void 0, void 0, function* () {
        const { id, email, emailVerifyToken } = params;
        const filter = {};
        if (id) {
            filter._id = id;
        }
        if (email) {
            filter.email = email;
        }
        if (emailVerifyToken) {
            filter.emailVerifyToken = emailVerifyToken;
        }
        const doc = yield api_1.UserModel.findOne(filter);
        const user = lib_1.RepositoryLib.transformDocuments(doc);
        return user;
    });
    UsersRepository.update = (service, ctx, params) => __awaiter(this, void 0, void 0, function* () {
        const doc = yield api_1.UserModel.findByIdAndUpdate(params.id, { $set: params }, {
            upsert: true,
            new: true,
        });
        const userUpdated = lib_1.RepositoryLib.transformDocuments(doc);
        void ctx.emit("user.updated", { user: userUpdated, params });
        if (userUpdated.emailStatus === "pending") {
            void ctx.emit("user.email.updated", { user: userUpdated, params });
        }
        return userUpdated;
    });
})(UsersRepository = exports.UsersRepository || (exports.UsersRepository = {}));
//# sourceMappingURL=users.repository.js.map