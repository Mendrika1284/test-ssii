export type VConfirmDialog = Vue & {
  open: (
    message: string,
    options?: {
      color?: string;
      width?: number;
      zIndex?: number;
    }
  ) => Promise<boolean>;
};
