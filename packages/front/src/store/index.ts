import { getModule } from "vuex-module-decorators";
import "./config";

// Set Production Config
import { CoreState, CoreStore } from "./modules/Core.store";
import {
  UserAccountState,
  UserAccountStore,
} from "./modules/UserAccount.store";
import { UserState, UserStore } from "./modules/User.store";
import { ExamplesState, ExamplesStore } from "./modules/Examples.store";

export interface RootState {
  core: CoreState;
  userAccount: UserAccountState;
  user: UserState;
  examples: ExamplesState;
}

export const coreStore = getModule(CoreStore);
export const userAccountStore = getModule(UserAccountStore);
export const userStore = getModule(UserStore);
export const examplesStore = getModule(ExamplesStore);
