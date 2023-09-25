import axios from "axios";

class CoreService {
  async getVersion(): Promise<{
    ok: boolean;
    version: { back: string; front: string; api: string };
  }> {
    return axios.get(`/version`).then((res) => {
      return res.data;
    });
  }
}

// Export a singleton instance in the global namespace
export const coreService = new CoreService();
