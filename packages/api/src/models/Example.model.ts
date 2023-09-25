import { Document, model, Schema } from "mongoose";
import { ulid } from "ulid";
import { RequireField } from "./Common.model";
import { ToObjectOptions } from "mongoose";

/**
 * * Types
 */
export type Example = {
  id: string;
  userId: string;
  example: boolean;
  createdAt: string;
  updatedAt: string;
};
export type ExampleCreate = Omit<Example, "id" | "userId" | "createdAt" | "updatedAt">;
export type ExampleCreateInternal = Omit<Example, "id" | "createdAt" | "updatedAt">;
export type ExampleUpdate = RequireField<Partial<Omit<Example, "userId" | "createdAt" | "updatedAt">>, "id">;
export type ExampleUpdateInternal = RequireField<Partial<Omit<Example, "createdAt" | "updatedAt">>, "id">;

/**
 * * Model
 */
export type ExampleDocument = Example & Document<string>;
const exampleSchema = new Schema<ExampleDocument>(
  {
    _id: { type: String, default: () => ulid() },
    userId: { type: String, index: true, required: true },
    example: { type: Boolean, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      virtuals: true,
      transform(
        doc: Omit<ExampleDocument, "createdAt" | "updatedAt"> & { _id: string; createdAt: Date; updatedAt: Date },
        ret: Example & { _id?: string },
        options: ToObjectOptions
      ): Omit<Example, "_id"> {
        ret.id = doc._id;
        delete ret._id;
        return ret;
      },
    },
  }
);
export const ExampleModel = model<ExampleDocument>("Example", exampleSchema, "Examples");

/**
 * * API
 */
export namespace ExamplesService {
  export type CreateIn = ExampleCreate;
  export type CreateOut = Example;

  export type ListIn = Pick<Example, "userId">;
  export type ListOut = Example[];

  export type GetIn = Pick<Example, "id">;
  export type GetOut = Example;

  export type UpdateIn = ExampleUpdate;
  export type UpdateOut = Example;

  export type DeleteIn = Pick<Example, "id">;
  export type DeleteOut = boolean;
}
