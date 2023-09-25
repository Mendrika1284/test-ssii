"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const ulid_1 = require("ulid");
const userSchema = new mongoose_1.Schema({
    _id: { type: String, default: () => (0, ulid_1.ulid)() },
    firstName: { type: String, required: false /* On boarding */ },
    lastName: { type: String, required: false /* On boarding */ },
    email: {
        type: String,
        required: false,
        index: {
            unique: true,
            partialFilterExpression: { email: { $type: "string" } },
        },
    },
    emailStatus: { type: String, default: "pending", enum: ["invalid", "waiting", "pending", "confirmed"] },
    emailVerifyToken: { type: String },
    emailVerifyExpirationDate: { type: String },
    newEmail: {
        type: String,
        required: false,
        index: {
            unique: true,
            partialFilterExpression: { newEmail: { $type: "string" } },
        },
    },
    phone: { type: String, required: false /* On boarding */ },
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
exports.UserModel = (0, mongoose_1.model)("User", userSchema, "Users");
//# sourceMappingURL=User.model.js.map