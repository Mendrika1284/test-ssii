import { Module, VuexModule, Action, Mutation } from "vuex-module-decorators";
import store from "@/store/root";
import { User, UsersService } from "@edmp/api";
import { usersService } from "@/services";
import { dispatchUserEvent } from "@/events";

export interface UserState {
  loading: boolean;
  user: User | null;
}

@Module({
  name: "user-store",
  dynamic: true,
  namespaced: true,
  store,
})
export class UserStore extends VuexModule implements UserState {
  loading = false;
  user: User | null = null;

  @Mutation
  reset(): void {
    this.loading = false;
    this.user = null;
  }

  @Mutation
  setLoading(isLoading: boolean): void {
    this.loading = isLoading;
  }

  get isLogged(): boolean {
    return this.user !== null;
  }

  @Mutation
  setUser(user: User | null = null): void {
    this.user = user;
    try {
      if (user) {
        dispatchUserEvent(user);
      }
    } catch (e) {
      console.error(e);
    }
  }

  @Action
  async fetchLoggedUser() {
    try {
      this.setLoading(true);
      const user = await usersService.get();
      this.setUser(user);
      return user;
    } catch (err) {
      // Reset User in case of error
      this.setUser();
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * ! Cannot save in store
   */
  @Action
  async getUser(params: UsersService.GetIn) {
    try {
      this.setLoading(true);
      const user = await usersService.get(params);
      return user;
    } finally {
      this.setLoading(false);
    }
  }

  @Action
  async updateUser(userUpdate: UsersService.UpdateIn) {
    try {
      this.setLoading(true);
      const user = await usersService.update(userUpdate);
      this.setUser(user);
      return user;
    } finally {
      this.setLoading(false);
      this.fetchLoggedUser();
    }
  }

  /**
   * Public route
   */
  @Action
  async validateEmail(emailValidate: UsersService.ValidateEmailIn) {
    try {
      this.setLoading(true);
      const user = await usersService.validateEmail(emailValidate);
      this.setUser(user);
      return user;
    } finally {
      this.setLoading(false);
      this.fetchLoggedUser();
    }
  }
}
