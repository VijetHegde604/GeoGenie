// api/recognize.ts
import { Platform } from "react-native";
import api from "./clients";
import { runUploadTask } from "./uploadQueue";

const getImageParts = (uri: string) => {
  const originalFilename = uri.split("/").pop() || "photo.jpg";
  const rawExt = originalFilename.split(".").pop()?.toLowerCase();
  const ext = rawExt && rawExt !== originalFilename ? rawExt : "jpg";
  const filename = `photo.${ext}`;

  const mime =
    ext === "png"
      ? "image/png"
      : ext === "webp"
        ? "image/webp"
        : "image/jpeg"; // covers jpeg, heic, content URIs, and anything unknown

  return { filename, mime };
};

const appendImage = async (
  form: FormData,
  fieldName: string,
  uri: string,
  filename: string,
  mime: string,
) => {
  if (Platform.OS === "web") {
    const blob = await fetch(uri).then((response) => response.blob());
    const uploadBlob =
      typeof File !== "undefined"
        ? new File([blob], filename, { type: blob.type || mime })
        : blob;
    form.append(fieldName, uploadBlob, filename);
    return;
  }

  form.append(fieldName, { uri, name: filename, type: mime } as any);
};

export const RecognizeAPI = {
  recognize: async (uri: string, latitude?: number, longitude?: number) =>
    runUploadTask(async () => {
      const { filename, mime } = getImageParts(uri);
      const form = new FormData();

      await appendImage(form, "file", uri, filename, mime);
      await appendImage(form, "image", uri, filename, mime);

      if (latitude !== undefined) form.append("latitude", String(latitude));
      if (longitude !== undefined) form.append("longitude", String(longitude));

      const res = await api.post("/recognize", form, {
        headers: Platform.OS === "web" ? undefined : { "Content-Type": "multipart/form-data" },
        timeout: 45000,
      });
      return res.data;
    }),
};
