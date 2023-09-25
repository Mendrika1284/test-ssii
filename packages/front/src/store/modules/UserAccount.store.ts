import { Module, VuexModule, Action, Mutation } from "vuex-module-decorators";
import store from "@/store/root";
import { JwtToken, UserAccount, UserAccountsService } from "@edmp/api";
import { userAccountsService } from "@/services";
import { userStore } from "..";
import router from "@/router";
import { ROUTE_NAMES } from "@/router/routes";

export interface UserAccountState {
  loading: boolean;
  userAccount: UserAccount | null;
  jwtToken: JwtToken | undefined;
}

@Module({
  name: "user-account-store",
  dynamic: true,
  namespaced: true,
  store,
})
export class UserAccountStore extends VuexModule implements UserAccountState {
  loading = false;
  userAccount: UserAccount | null = null;
  jwtToken: JwtToken | undefined = undefined;

  @Mutation
  reset(): void {
    this.loading = false;
    this.userAccount = null;
  }

  @Mutation
  setLoading(isLoading: boolean): void {
    this.loading = isLoading;
  }

  get isLogged(): boolean {
    return this.userAccount !== null;
  }

  @Mutation
  setUserAccount(userAccount: UserAccount | null = null): void {
    this.userAccount = userAccount;
  }

  @Mutation
  setJwtToken(jwtToken?: JwtToken): void {
    this.jwtToken = jwtToken;
  }

  @Action
  async fetchLoggedUserAccount() {
    try {
      this.setLoading(true);
      const payload = await userAccountsService.getLogged();
      const userAccount = await userAccountsService.get({ id: payload.id });
      this.setUserAccount(userAccount);
      return userAccount;
    } catch (err) {
      // Reset User in case of error
      this.setUserAccount();
    } finally {
      this.setLoading(false);
      await userStore.fetchLoggedUser();
    }
  }

  /**
   * ! Cannot save in store
   */
  @Action
  async fetchUserAccount(params: UserAccountsService.GetIn) {
    try {
      this.setLoading(true);
      const userAccount = await userAccountsService.get(params);
      return userAccount;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Public route
   */
  @Action
  async createUserAccount(userAccountCreate: UserAccountsService.CreateIn) {
    try {
      this.setLoading(true);
      const userAccount = await userAccountsService.create(userAccountCreate);
      this.setUserAccount(userAccount);
      return userAccount;
    } finally {
      this.setLoading(false);
    }
  }

  @Action
  async updateUserAccount(userAccountUpdate: UserAccountsService.UpdateIn) {
    try {
      this.setLoading(true);
      const userAccount = await userAccountsService.update(userAccountUpdate);
      this.setUserAccount(userAccount);
      return userAccount;
    } finally {
      this.setLoading(false);
      await this.fetchLoggedUserAccount();
    }
  }

  /**
   * Public route
   */
  @Action
  async login(credentials: UserAccountsService.LoginIn) {
    try {
      this.setLoading(true);
      const jwtToken = await userAccountsService.login(credentials);
      this.setJwtToken(jwtToken);
    } finally {
      this.setLoading(false);
      await this.fetchLoggedUserAccount();
    }
  }

  @Action
  async renewLogin() {
    try {
      this.setLoading(true);
      const jwtToken = await userAccountsService.renewLogin();
      this.setJwtToken(jwtToken);
    } finally {
      this.setLoading(false);
      await this.fetchLoggedUserAccount();
    }
  }

  @Action
  async logout() {
    try {
      this.setLoading(true);
      await userAccountsService.logout();
      this.setJwtToken();
      this.setUserAccount();
      userStore.setUser();
      router.push({ name: ROUTE_NAMES.Root });
    } finally {
      this.setLoading(false);
    }
  }
}
