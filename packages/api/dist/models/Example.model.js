"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleModel = void 0;
const mongoose_1 = require("mongoose");
const ulid_1 = require("ulid");
const exampleSchema = new mongoose_1.Schema({
    _id: { type: String, default: () => (0, ulid_1.ulid)() },
    userId: { type: String, index: true, required: true },
    example: { type: Boolean, required: true },
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
exports.ExampleModel = (0, mongoose_1.model)("Example", exampleSchema, "Examples");
//# sourceMappingURL=Example.model.js.map