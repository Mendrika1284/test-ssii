import { Document, model, Schema, ToObjectOptions } from "mongoose";
import { User } from "./User.model";
import { OneOf, RequireField } from "./Common.model";
import { v4 as uuidV4 } from "uuid";

/**
 * * Types
 */
export type Scope = "anonymous" | "member" | "support" | "admin" | "system";

export interface UserAccount {
  id: string;
  username: string;
  scope: Scope;
  createdAt: string;
  updatedAt: string;
}

export type UserAccountCreate = Omit<UserAccount, "id" | "scope" | "createdAt" | "updatedAt">;
export type UserAccountCreateInternal = Omit<UserAccount, "id" | "createdAt" | "updatedAt">;

export type UserAccountUpdate = RequireField<Partial<Omit<UserAccount, "scope" | "createdAt" | "updatedAt">>, "id">;
export type UserAccountUpdateInternal = RequireField<
  Partial<Omit<UserAccount, "act" | "createdAt" | "updatedAt">>,
  "id"
>;

export type JwtToken = {
  id_token: string;
  token_type: string; // "Bearer"
};

export type Payload = Pick<UserAccount, "id" | "username" | "scope">;

export type MetaUser = Payload & { extended?: User };

/**
 * * Model
 */
export type UserAccountDocument = UserAccount & Document<string>;
const userAccountSchema = new Schema<UserAccountDocument>(
  {
    _id: { type: String, default: () => uuidV4() },
    username: { type: String, required: true, unique: true, index: true },
    scope: { type: String, required: true, enum: ["anonymous", "member", "support", "admin", "system"] },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      virtuals: true,
      transform(
        doc: Omit<UserAccountDocument, "createdAt" | "updatedAt"> & { _id: string; createdAt: Date; updatedAt: Date },
        ret: UserAccount & { _id?: string },
        options: ToObjectOptions
      ): Omit<UserAccount, "_id"> {
        ret.id = doc._id;
        delete ret._id;
        return ret;
      },
    },
  }
);
export const UserAccountModel = model<UserAccountDocument>("UserAccount", userAccountSchema, "UserAccounts");

/**
 * * API
 */
export namespace UserAccountsService {
  // ! Route public
  export type CreateIn = UserAccountCreate;
  export type CreateOut = UserAccount;

  export type GetIn = Pick<UserAccount, "id">;
  export type GetOut = UserAccount;

  export type UpdateIn = UserAccountUpdate;
  export type UpdateOut = UserAccount;

  // ! Route public
  export type LoginIn = OneOf<Pick<UserAccount, "id">, Pick<UserAccount, "username">>;
  export type LoginOut = JwtToken;

  export type GetLoginIn = never;
  export type GetLoginOut = Payload;

  export type RenewLoginIn = never;
  export type RenewLoginOut = JwtToken;

  export type LogoutIn = never;
  export type LogoutOut = void;
}
