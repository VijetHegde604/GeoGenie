// api/landmarks.ts
import api from "./clients";

export const LandmarksAPI = {
  list: async () => {
    const res = await api.get("/landmarks");
    return res.data;
  },

  listFolders: async () => {
    const res = await api.get("/landmarks/list");
    return res.data;
  },

  addLandmark: async (name: string) => {
    const form = new FormData();
    form.append("name", name);

    const res = await api.post("/landmarks/add", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return res.data;
  },
};
