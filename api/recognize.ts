// api/recognize.ts
import api from "./clients";

export const RecognizeAPI = {
  recognize: async (uri: string, latitude?: number, longitude?: number) => {
    const filename = uri.split("/").pop() || "photo.jpg";
    const mime = filename.toLowerCase().endsWith(".png")
      ? "image/png"
      : "image/jpeg";

    const form = new FormData();
    const filePart = {
      uri,
      name: filename,
      type: mime,
    } as any;

    // Keep both keys for backend compatibility (some servers expect `file`,
    // others `image`) to avoid 422 validation errors.
    form.append("file", filePart);
    form.append("image", filePart);

    if (latitude !== undefined) form.append("latitude", String(latitude));
    if (longitude !== undefined) form.append("longitude", String(longitude));

    const res = await api.post("/recognize", form);

    return res.data;
  },
};
