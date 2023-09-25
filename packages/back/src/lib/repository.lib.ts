import { ServiceBroker } from "moleculer";
import mongoose from "mongoose";
import { InternalServerError } from "./error";

type TransformLeanDocument<
  Document extends mongoose.Document<string> | mongoose.Document<string>[] | null | undefined
> = Document extends null | undefined
  ? undefined
  : Document extends (infer Document)[] // If is array
  ? mongoose.LeanDocument<Document>[]
  : mongoose.LeanDocument<Document>;

export namespace RepositoryLib {
  export const connect = async (broker: ServiceBroker): Promise<void> => {
    const { mongo } = broker.options.$settings.services;
    const { connection } = mongoose;

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
    connection.on("error", (error: unknown) => {
      void broker.emit("repository.error", { status: "error", error });
      broker.logger.error("DB error:", error);
    });

    try {
      await mongoose.connect(mongo, {
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
    } catch (error) {
      throw new InternalServerError("MongoDB connection error", "DB_ERROR", { error });
    }

    if (connection.readyState !== mongoose.STATES.connected) {
      throw new InternalServerError("MongoDB connection failed", "DB_ERROR", {
        status: mongoose.STATES[mongoose.connection.readyState],
      });
    }
  };

  export const disconnect = async (): Promise<void> => {
    try {
      await mongoose.connection.close();
    } catch (error) {
      throw new InternalServerError("MongoDB disconnect error", "DB_ERROR", { error });
    }
  };

  export const transformDocuments = <
    Document extends mongoose.Document<string> | mongoose.Document<string>[] | null | undefined
  >(
    documents: Document
  ): TransformLeanDocument<Document> => {
    if (!Array.isArray(documents)) {
      const doc = documents?.toJSON() as TransformLeanDocument<Document> & {
        createdAt: Date | string;
        updatedAt: Date | string;
      };
      if (doc && !Array.isArray(doc)) {
        if (doc.createdAt instanceof Date) {
          doc.createdAt = doc.createdAt.toISOString();
        }
        if (doc.updatedAt instanceof Date) {
          doc.updatedAt = doc.updatedAt.toISOString();
        }
      }
      return doc as TransformLeanDocument<Document>;
    }
    return documents.map((document) => {
      const doc = document.toJSON() as TransformLeanDocument<Document> & {
        createdAt: Date | string;
        updatedAt: Date | string;
      };
      if (doc.createdAt instanceof Date) {
        doc.createdAt = doc.createdAt.toISOString();
      }
      if (doc.updatedAt instanceof Date) {
        doc.updatedAt = doc.updatedAt.toISOString();
      }
      return doc;
    }) as unknown as TransformLeanDocument<Document>;
  };
}
