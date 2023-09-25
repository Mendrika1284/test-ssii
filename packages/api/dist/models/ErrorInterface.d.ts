/**
 * This interface is used to specify error in our application
 *
 * It completes Error (name, message, stack) with additional data existing
 */
export interface ErrorInterface extends Error {
    code: number;
    type: string;
    data: Record<string, any>;
}
//# sourceMappingURL=ErrorInterface.d.ts.map