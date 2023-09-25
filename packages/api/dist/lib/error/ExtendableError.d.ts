import { ErrorInterface } from "../../models/ErrorInterface";
/**
 * Extendable errors class.
 *
 */
export declare class ExtendableError extends Error implements ErrorInterface {
    code: number;
    type: string;
    data: Record<string, any>;
    constructor(message: string, code: number | undefined, type: string, data?: Record<string, unknown>);
}
//# sourceMappingURL=ExtendableError.d.ts.map