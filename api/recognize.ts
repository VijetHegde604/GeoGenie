// api/recognize.ts
import api from "./clients";

export const RecognizeAPI = {
  recognize: async (uri: string, latitude?: number, longitude?: number) => {
    const filename = uri.split("/").pop() || "photo.jpg";
    const mime = filename.toLowerCase().endsWith(".png")
      ? "image/png"
      : "image/jpeg";

    const form = new FormData();

    // Expo native accepts { uri, name, type } while web requires a Blob/File.
    const isWeb = typeof window !== "undefined";
    if (isWeb) {
      const blob = await fetch(uri).then((r) => r.blob());
      form.append("image", blob, filename);
    } else {
      const filePart = {
        uri,
        name: filename,
        type: mime,
      } as any;
      form.append("image", filePart);
    }

    if (latitude !== undefined) form.append("latitude", String(latitude));
    if (longitude !== undefined) form.append("longitude", String(longitude));

    const res = await api.post("/recognize", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },
};
