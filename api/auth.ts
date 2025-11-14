// api/auth.ts
import api from "./clients";

export const AuthAPI = {
  login: async (username: string, password: string) => {
    const res = await api.post("/auth/login", { username, password });
    return res.data;
  },

  register: async (username: string, password: string) => {
    const form = new FormData();
    form.append("username", username);
    form.append("password", password);

    const res = await api.post("/auth/register", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return res.data;
  },

  me: async () => {
    const res = await api.get("/auth/me");
    return res.data;
  },
};
