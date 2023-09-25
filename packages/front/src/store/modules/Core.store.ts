import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import store from "@/store/root";
import { coreStore } from "@/store";
import { coreService } from "@/services";
import { Feedback, FeedbackTypeEnum } from "@/models";

export interface CoreState {
  loadingApp: boolean;
  config: {
    versions: { back: string; front: string; api: string };
  };
  isOpenMobileMenu: boolean;

  feedback: {
    display: boolean;
    type?: FeedbackTypeEnum;
    message: string;
    timeout?: number;
  };
}

@Module({
  name: "core-store",
  dynamic: true,
  namespaced: true,
  store,
})
export class CoreStore extends VuexModule implements CoreState {
  loadingApp = false;
  config = {
    versions: { back: "", front: "", api: "" },
  };
  isOpenMobileMenu = false;

  feedback = {
    display: false,
    message: "",
  } as Feedback;

  timeoutFeedback: NodeJS.Timeout | null = null;

  @Mutation
  reset(): void {
    this.loadingApp = false;
    this.config = {
      versions: { back: "", front: "", api: "" },
    };
    this.isOpenMobileMenu = false;

    this.feedback = {
      display: false,
      message: "",
      type: FeedbackTypeEnum.INFO,
    };
  }

  // App loading
  @Mutation
  setLoadingApp(isLoading: boolean): void {
    this.loadingApp = isLoading;
  }

  @Action
  async appLoading(isLoading: boolean): Promise<void> {
    this.setLoadingApp(isLoading);
  }

  // Config
  @Mutation
  setConfig(config: CoreState["config"]): void {
    this.config = config;
  }

  @Action
  async getConfig(): Promise<CoreState["config"]> {
    const { version } = await coreService.getVersion();
    this.setConfig({
      versions: version,
    });

    return this.config;
  }

  // Mobile
  @Mutation
  setOpenMobileMenu(isOpen: boolean): void {
    this.isOpenMobileMenu = isOpen;
  }

  @Action
  async openMobileMenu(isOpen: boolean): Promise<void> {
    this.setOpenMobileMenu(isOpen);
  }

  // Feedback
  @Mutation
  setFeedback(feedback: Feedback): void {
    this.feedback = { ...feedback };
    if (feedback.timeout && feedback.timeout > 0) {
      if (this.timeoutFeedback) clearTimeout(this.timeoutFeedback);
      this.timeoutFeedback = setTimeout(
        () => coreStore.hideFeedback(),
        feedback.timeout
      );
    }
  }

  @Action
  async hideFeedback(): Promise<void> {
    this.setFeedback({ display: false, type: undefined, message: "" });
  }

  @Action
  displayFeedback(feedback: {
    type?: FeedbackTypeEnum;
    message: string;
    timeout?: number;
  }): void {
    this.setFeedback({
      display: true,
      type: feedback.type ? feedback.type : FeedbackTypeEnum.FEEDBACK,
      message: feedback.message,
      timeout: feedback.timeout ? feedback.timeout : 5000,
    });
  }
}
