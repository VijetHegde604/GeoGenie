// api/recognize.ts
import api from "./clients";

export const RecognizeAPI = {
  recognize: async (uri: string, latitude?: number, longitude?: number) => {
    const originalFilename = uri.split("/").pop() || "photo.jpg";
    const ext = originalFilename.split(".").pop()?.toLowerCase();
    const filename = ext ? `photo.${ext}` : "photo.jpg";

    const isWeb = typeof window !== "undefined";

    // Android doesn't support HEIC — always fall back to jpeg for unknown/heic
    const mime =
      ext === "png"
        ? "image/png"
        : ext === "webp"
          ? "image/webp"
          : "image/jpeg"; // covers jpeg, heic, and anything else

    const form = new FormData();

    if (isWeb) {
      const blob = await fetch(uri).then((r) => r.blob());
      form.append("file", blob, filename);
      form.append("image", blob, filename);
    } else {
      // Separate object literals per append — reusing the same reference breaks Android
      form.append("file", { uri, name: filename, type: mime } as any);
      form.append("image", { uri, name: filename, type: mime } as any);
    }

    if (latitude !== undefined) form.append("latitude", String(latitude));
    if (longitude !== undefined) form.append("longitude", String(longitude));

    const res = await api.post("/recognize", form, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 45000,
    });
    return res.data;
  },
};
