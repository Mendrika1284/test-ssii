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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryLib = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const error_1 = require("./error");
var RepositoryLib;
(function (RepositoryLib) {
    RepositoryLib.connect = (broker) => __awaiter(this, void 0, void 0, function* () {
        const { mongo } = broker.options.$settings.services;
        const { connection } = mongoose_1.default;
        connection.on("connected", () => {
            void broker.emit("repository.connected", { status: "connected" });
            broker.logger.info("DB connected");
        });
        connection.on("reconnected", () => {
            void broker.emit("repository.reconnected", { status: "disconnected" });
            broker.logger.warn("DB reconnected");
        });
        connection.on("disconnected", () => {
            void broker.emit("repository.disconnected", { status: "disconnected" });
            broker.logger.info("DB disconnected");
        });
        connection.on("close", () => {
            void broker.emit("repository.close", { status: "close" });
            broker.logger.info("DB close");
        });
        connection.on("error", (error) => {
            void broker.emit("repository.error", { status: "error", error });
            broker.logger.error("DB error:", error);
        });
        try {
            yield mongoose_1.default.connect(mongo, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                autoCreate: false,
                autoIndex: true,
                useCreateIndex: true,
                keepAlive: true,
                poolSize: 10,
                socketTimeoutMS: 45000,
            });
        }
        catch (error) {
            throw new error_1.InternalServerError("MongoDB connection error", "DB_ERROR", { error });
        }
        if (connection.readyState !== mongoose_1.default.STATES.connected) {
            throw new error_1.InternalServerError("MongoDB connection failed", "DB_ERROR", {
                status: mongoose_1.default.STATES[mongoose_1.default.connection.readyState],
            });
        }
    });
    RepositoryLib.disconnect = () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connection.close();
        }
        catch (error) {
            throw new error_1.InternalServerError("MongoDB disconnect error", "DB_ERROR", { error });
        }
    });
    RepositoryLib.transformDocuments = (documents) => {
        if (!Array.isArray(documents)) {
            const doc = documents === null || documents === void 0 ? void 0 : documents.toJSON();
            if (doc && !Array.isArray(doc)) {
                if (doc.createdAt instanceof Date) {
                    doc.createdAt = doc.createdAt.toISOString();
                }
                if (doc.updatedAt instanceof Date) {
                    doc.updatedAt = doc.updatedAt.toISOString();
                }
            }
            return doc;
        }
        return documents.map((document) => {
            const doc = document.toJSON();
            if (doc.createdAt instanceof Date) {
                doc.createdAt = doc.createdAt.toISOString();
            }
            if (doc.updatedAt instanceof Date) {
                doc.updatedAt = doc.updatedAt.toISOString();
            }
            return doc;
        });
    };
})(RepositoryLib = exports.RepositoryLib || (exports.RepositoryLib = {}));
//# sourceMappingURL=repository.lib.js.map