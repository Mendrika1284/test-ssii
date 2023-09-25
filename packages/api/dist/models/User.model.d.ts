import { Document } from "mongoose";
import { RequireField, Verified } from "./Common.model";
/**
 * * Types
 */
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
export declare type UserCreate = Omit<User, "id" | "emailVerifyToken" | "emailVerifyExpirationDate" | "createdAt" | "updatedAt">;
export declare type UserCreateInternal = Omit<User, "id" | "createdAt" | "updatedAt">;
export declare type UserUpdate = RequireField<Partial<Omit<User, "emailVerifyToken" | "emailVerifyExpirationDate" | "createdAt" | "updatedAt">>, "id">;
export declare type UserUpdateInternalService = RequireField<Partial<Omit<User, "emailVerifyToken" | "emailVerifyExpirationDate" | "createdAt" | "updatedAt">>, "id">;
export declare type UserUpdateInternalRepository = RequireField<Partial<Omit<User, "createdAt" | "updatedAt">>, "id">;
/**
 * * Model
 */
export declare type UserDocument = User & Document<string>;
export declare const UserModel: import("mongoose").Model<UserDocument, {}, {}>;
/**
 * * API
 */
export declare namespace UsersService {
    type GetIn = Pick<User, "id">;
    type GetOut = User;
    type UpdateIn = UserUpdate;
    type UpdateOut = User;
    type ValidateEmailIn = {
        token: string;
    };
    type ValidateEmailOut = User;
}
//# sourceMappingURL=User.model.d.ts.map