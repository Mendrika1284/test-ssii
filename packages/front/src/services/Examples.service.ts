import { ExamplesService } from "@edmp/api";
import axios from "axios";

const api = "/api/v1/examples";

class ExamplesService {
  async create(exampleCreate: ExamplesService.CreateIn) {
    return axios
      .post<ExamplesService.CreateOut>(`${api}`, exampleCreate)
      .then((res) => res.data);
  }

  async list(params: ExamplesService.ListIn) {
    return axios
      .get<ExamplesService.ListOut>(`${api}`, { params })
      .then((res) => {
        return res.data;
      });
  }

  async get({ id }: ExamplesService.GetIn) {
    return axios.get<ExamplesService.GetOut>(`${api}/${id}`).then((res) => {
      return res.data;
    });
  }

  async update({ id, ...userUpdate }: ExamplesService.UpdateIn) {
    return axios
      .put<ExamplesService.UpdateOut>(`${api}/${id}`, userUpdate)
      .then((res) => res.data);
  }

  async delete({ id }: ExamplesService.DeleteIn) {
    return axios
      .delete<ExamplesService.DeleteOut>(`${api}/${id}`)
      .then((res) => res.data);
  }
}

// Export a singleton instance in the global namespace
export const examplesService = new ExamplesService();
