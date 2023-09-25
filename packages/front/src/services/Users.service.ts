import { UsersService } from "@edmp/api";
import axios from "axios";

const api = "/api/v1/users";

class UsersService {
  async get(params?: UsersService.GetIn) {
    if (!params) {
      params = { id: "me" };
    }
    return axios.get<UsersService.GetOut>(`${api}/${params.id}`).then((res) => {
      return res.data;
    });
  }

  async update({ id, ...userUpdate }: UsersService.UpdateIn) {
    return axios
      .put<UsersService.UpdateOut>(`${api}/${id}`, userUpdate)
      .then((res) => res.data);
  }

  /**
   * Public route
   */
  async validateEmail({ token }: UsersService.ValidateEmailIn) {
    return axios
      .post<UsersService.ValidateEmailOut>(
        `${api}/validate-email`,
        { token },
        {
          headers: {
            ERROR_HANDLER_STRATEGY: "IGNORE",
          },
        }
      )
      .then((res) => {
        return res.data;
      });
  }
}

// Export a singleton instance in the global namespace
export const usersService = new UsersService();
