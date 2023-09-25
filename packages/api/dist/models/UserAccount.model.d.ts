import { Document } from "mongoose";
import { User } from "./User.model";
import { OneOf, RequireField } from "./Common.model";
/**
 * * Types
 */
export declare type Scope = "anonymous" | "member" | "support" | "admin" | "system";
export interface UserAccount {
    id: string;
    username: string;
    scope: Scope;
    createdAt: string;
    updatedAt: string;
}
export declare type UserAccountCreate = Omit<UserAccount, "id" | "scope" | "createdAt" | "updatedAt">;
export declare type UserAccountCreateInternal = Omit<UserAccount, "id" | "createdAt" | "updatedAt">;
export declare type UserAccountUpdate = RequireField<Partial<Omit<UserAccount, "scope" | "createdAt" | "updatedAt">>, "id">;
export declare type UserAccountUpdateInternal = RequireField<Partial<Omit<UserAccount, "act" | "createdAt" | "updatedAt">>, "id">;
export declare type JwtToken = {
    id_token: string;
    token_type: string;
};
export declare type Payload = Pick<UserAccount, "id" | "username" | "scope">;
export declare type MetaUser = Payload & {
    extended?: User;
};
/**
 * * Model
 */
export declare type UserAccountDocument = UserAccount & Document<string>;
export declare const UserAccountModel: import("mongoose").Model<UserAccountDocument, {}, {}>;
/**
 * * API
 */
export declare namespace UserAccountsService {
    type CreateIn = UserAccountCreate;
    type CreateOut = UserAccount;
    type GetIn = Pick<UserAccount, "id">;
    type GetOut = UserAccount;
    type UpdateIn = UserAccountUpdate;
    type UpdateOut = UserAccount;
    type LoginIn = OneOf<Pick<UserAccount, "id">, Pick<UserAccount, "username">>;
    type LoginOut = JwtToken;
    type GetLoginIn = never;
    type GetLoginOut = Payload;
    type RenewLoginIn = never;
    type RenewLoginOut = JwtToken;
    type LogoutIn = never;
    type LogoutOut = void;
}
//# sourceMappingURL=UserAccount.model.d.ts.map