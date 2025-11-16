import api from "./clients";

export const FeedbackAPI = {
  uploadImage: async (uri: string, mime: string) => {
    const form = new FormData();
    form.append("file", {
      uri,
      name: "feedback.jpg",
      type: mime,
    } as any);

    return (await api.post("/feedback/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    })).data;
  },

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

    console.log("🟡 META FORM:", [...(form as any)]);

    return (await api.post("/feedback/meta", form, {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      timeout: 20000,
    })).data;
  },
};
