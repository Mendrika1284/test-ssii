export interface Feedback {
  display: boolean;
  type?: FeedbackTypeEnum;
  message: string;
  timeout?: number;
}

export enum FeedbackTypeEnum {
  INFO = "INFO",
  FEEDBACK = "FEEDBACK",
  WARNING = "WARNING",
  ERROR = "ERROR",
}
