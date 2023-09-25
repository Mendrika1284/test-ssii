import { Document, model, Schema, ToObjectOptions } from "mongoose";
import { ulid } from "ulid";
import { RequireField, Verified } from "./Common.model";

/**
 * * Types
 */

// User
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailStatus: Verified;
  emailVerifyToken?: string;
  emailVerifyExpirationDate?: string;
  newEmail?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserCreate = Omit<
  User,
  "id" | "emailVerifyToken" | "emailVerifyExpirationDate" | "createdAt" | "updatedAt"
>;
export type UserCreateInternal = Omit<User, "id" | "createdAt" | "updatedAt">;

export type UserUpdate = RequireField<
  Partial<Omit<User, "emailVerifyToken" | "emailVerifyExpirationDate" | "createdAt" | "updatedAt">>,
  "id"
>;
export type UserUpdateInternalService = RequireField<
  Partial<Omit<User, "emailVerifyToken" | "emailVerifyExpirationDate" | "createdAt" | "updatedAt">>,
  "id"
>;
export type UserUpdateInternalRepository = RequireField<Partial<Omit<User, "createdAt" | "updatedAt">>, "id">;

/**
 * * Model
 */

export type UserDocument = User & Document<string>;
const userSchema = new Schema<UserDocument>(
  {
    _id: { type: String, default: () => ulid() },
    firstName: { type: String, required: false /* On boarding */ },
    lastName: { type: String, required: false /* On boarding */ },
    email: {
      type: String,
      required: false, // only required for connected users
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
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      virtuals: true,
      transform(
        doc: Omit<UserDocument, "createdAt" | "updatedAt"> & { _id: string; createdAt: Date; updatedAt: Date },
        ret: User & { _id?: string },
        options: ToObjectOptions
      ): Omit<User, "_id"> {
        ret.id = doc._id;
        delete ret._id;
        return ret;
      },
    },
  }
);
export const UserModel = model<UserDocument>("User", userSchema, "Users");

/**
 * * API
 */
export namespace UsersService {
  export type GetIn = Pick<User, "id">;
  export type GetOut = User;

  export type UpdateIn = UserUpdate;
  export type UpdateOut = User;

  // ! Route public
  export type ValidateEmailIn = { token: string };
  export type ValidateEmailOut = User;
}
