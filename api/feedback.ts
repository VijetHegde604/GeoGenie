import { Platform } from "react-native";
import api from "./clients";
import { runUploadTask } from "./uploadQueue";

const appendFeedbackFile = async (form: FormData, uri: string, mime: string) => {
  const filename = `feedback.${mime.split("/")[1] || "jpg"}`;

  if (Platform.OS === "web") {
    const blob = await fetch(uri).then((response) => response.blob());
    const uploadBlob =
      typeof File !== "undefined"
        ? new File([blob], filename, { type: blob.type || mime })
        : blob;
    form.append("file", uploadBlob, filename);
    return;
  }

  form.append("file", {
    uri,
    name: filename,
    type: mime,
  } as any);
};

export const FeedbackAPI = {
  uploadImage: async (uri: string, mime: string) =>
    runUploadTask(async () => {
      const form = new FormData();
      await appendFeedbackFile(form, uri, mime);

      return (await api.post("/feedback/upload", form, {
        headers: Platform.OS === "web" ? undefined : { "Content-Type": "multipart/form-data" },
      })).data;
    }),

  updateMeta: async (
    image_id: number | string,
    landmark_name: string,
    description?: string,
    latitude?: string,
    longitude?: string
  ) => {
    console.log("🟡 BUILDING META REQUEST", {
      image_id,
      landmark_name,
      description,
      latitude,
      longitude,
    });

    const form = new FormData();
    form.append("image_id", String(image_id));
    form.append("landmark_name", landmark_name);

    if (description) form.append("description", description);
    if (latitude) form.append("latitude", latitude);
    if (longitude) form.append("longitude", longitude);

    return (await api.post("/feedback/meta", form, {
      headers: {
        Accept: "application/json",
        ...(Platform.OS === "web" ? {} : { "Content-Type": "multipart/form-data" }),
      },
      timeout: 20000,
    })).data;
  },
};
