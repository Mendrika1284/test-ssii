import { Document } from "mongoose";
import { RequireField } from "./Common.model";
/**
 * * Types
 */
export declare type Example = {
    id: string;
    userId: string;
    example: boolean;
    createdAt: string;
    updatedAt: string;
};
export declare type ExampleCreate = Omit<Example, "id" | "userId" | "createdAt" | "updatedAt">;
export declare type ExampleCreateInternal = Omit<Example, "id" | "createdAt" | "updatedAt">;
export declare type ExampleUpdate = RequireField<Partial<Omit<Example, "userId" | "createdAt" | "updatedAt">>, "id">;
export declare type ExampleUpdateInternal = RequireField<Partial<Omit<Example, "createdAt" | "updatedAt">>, "id">;
/**
 * * Model
 */
export declare type ExampleDocument = Example & Document<string>;
export declare const ExampleModel: import("mongoose").Model<ExampleDocument, {}, {}>;
/**
 * * API
 */
export declare namespace ExamplesService {
    type CreateIn = ExampleCreate;
    type CreateOut = Example;
    type ListIn = Pick<Example, "userId">;
    type ListOut = Example[];
    type GetIn = Pick<Example, "id">;
    type GetOut = Example;
    type UpdateIn = ExampleUpdate;
    type UpdateOut = Example;
    type DeleteIn = Pick<Example, "id">;
    type DeleteOut = boolean;
}
//# sourceMappingURL=Example.model.d.ts.map