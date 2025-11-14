// api/recognize.ts
import api from "./clients";

export const RecognizeAPI = {
  recognize: async (uri: string, latitude?: number, longitude?: number) => {
    const form = new FormData();
    form.append("image", {
      uri,
      name: "photo.jpg",
      type: "image/jpeg",
    } as any);

    if (latitude !== undefined) form.append("latitude", String(latitude));
    if (longitude !== undefined) form.append("longitude", String(longitude));

    const res = await api.post("/recognize", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  },
};
