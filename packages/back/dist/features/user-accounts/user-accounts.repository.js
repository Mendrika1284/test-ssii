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
exports.UserAccountsRepository = void 0;
const api_1 = require("@edmp/api");
const lib_1 = require("@/lib");
var UserAccountsRepository;
(function (UserAccountsRepository) {
    UserAccountsRepository.create = (service, ctx, params) => __awaiter(this, void 0, void 0, function* () {
        const doc = yield api_1.UserAccountModel.create(params);
        const userAccountCreated = lib_1.RepositoryLib.transformDocuments(doc);
        void ctx.emit("user-account.created", { userAccount: userAccountCreated, params });
        return userAccountCreated;
    });
    UserAccountsRepository.get = (service, ctx, params) => __awaiter(this, void 0, void 0, function* () {
        const { id, username } = params;
        const filter = {};
        if (id) {
            filter._id = id;
        }
        if (username) {
            filter.username = username;
        }
        const doc = yield api_1.UserAccountModel.findOne(filter);
        const userAccount = lib_1.RepositoryLib.transformDocuments(doc);
        return userAccount;
    });
    UserAccountsRepository.update = (service, ctx, params) => __awaiter(this, void 0, void 0, function* () {
        const doc = yield api_1.UserAccountModel.findByIdAndUpdate(params.id, { $set: params }, {
            upsert: true,
            new: true,
        });
        const userAccountUpdated = lib_1.RepositoryLib.transformDocuments(doc);
        void ctx.emit("user-account.updated", { userAccount: userAccountUpdated, params });
        return userAccountUpdated;
    });
})(UserAccountsRepository = exports.UserAccountsRepository || (exports.UserAccountsRepository = {}));
//# sourceMappingURL=user-accounts.repository.js.map