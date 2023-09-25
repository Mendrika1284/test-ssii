"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAccountModel = void 0;
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const userAccountSchema = new mongoose_1.Schema({
    _id: { type: String, default: () => (0, uuid_1.v4)() },
    username: { type: String, required: true, unique: true, index: true },
    scope: { type: String, required: true, enum: ["anonymous", "member", "support", "admin", "system"] },
}, {
    timestamps: true,
    toJSON: {
        versionKey: false,
        virtuals: true,
        transform(doc, ret, options) {
            ret.id = doc._id;
            delete ret._id;
            return ret;
        },
    },
});
exports.UserAccountModel = (0, mongoose_1.model)("UserAccount", userAccountSchema, "UserAccounts");
//# sourceMappingURL=UserAccount.model.js.map