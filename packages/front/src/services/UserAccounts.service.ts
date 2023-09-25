import { UserAccountsService } from "@edmp/api";
import axios from "axios";

const meta = "/meta/v1";
const api = "/api/v1/user-accounts";

class UserAccountsService {
  /**
   * ! Public route
   */
  async create(userCreate: UserAccountsService.CreateIn) {
    return axios
      .post<UserAccountsService.CreateOut>(`${api}`, userCreate)
      .then((res) => res.data);
  }

  async get({ id }: UserAccountsService.GetIn) {
    return axios
      .get<UserAccountsService.GetOut>(`${api}/${id}`)
      .then((res) => res.data);
  }

  async update({ id, ...userAccountUpdate }: UserAccountsService.UpdateIn) {
    return axios
      .put<UserAccountsService.UpdateOut>(`${api}/${id}`, userAccountUpdate)
      .then((res) => res.data);
  }

  /**
   * ! Public route
   */
  async login(credentials: UserAccountsService.LoginIn) {
    return axios
      .post<UserAccountsService.LoginOut>(`${meta}/login`, credentials, {
        headers: {
          ERROR_HANDLER_STRATEGY: "IGNORE",
        },
      })
      .then((res) => {
        return res.data;
      });
  }

  async getLogged() {
    return axios
      .get<UserAccountsService.GetLoginOut>(`${meta}/login`)
      .then((res) => {
        return res.data;
      });
  }

  async renewLogin() {
    return axios
      .post<UserAccountsService.RenewLoginOut>(`${meta}/renew`)
      .then((res) => {
        return res.data;
      });
  }

  async logout() {
    return axios
      .post<UserAccountsService.LogoutOut>(`${meta}/logout`)
      .then((res) => {
        return res.data;
      });
  }
}

// Export a singleton instance in the global namespace
export const userAccountsService = new UserAccountsService();
