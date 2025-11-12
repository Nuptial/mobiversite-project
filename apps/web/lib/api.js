import axios from "axios";
export const api = axios.create({ baseURL: "/api", withCredentials: true });
api.interceptors.response.use(
  (r) => r,
  async (err) => {
    if (err.response?.status === 401) {
      try {
        await axios.post("/api/auth/refresh", {}, { withCredentials: true });
        return api.request(err.config);
      } catch {
        if (typeof window !== "undefined") window.location.href = "/login";
      }
    }
    throw err;
  }
);
