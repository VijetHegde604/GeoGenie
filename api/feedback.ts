import api from "./clients";

export const FeedbackAPI = {
  submitFeedback: async (
    imageUri: string,
    landmarkName: string,
    description: string,
    lat?: string,
    lng?: string
  ) => {
    const form = new FormData();

    const asset = {
      uri: imageUri,
      name: "feedback.jpg",
      type: "image/jpeg",
    };

    form.append("file", asset as any);
    form.append("landmark_name", landmarkName);

    if (description) form.append("description", description);
    if (lat) form.append("latitude", lat);
    if (lng) form.append("longitude", lng);

    // Axios auto-sets multipart boundary
    return (await api.post("/feedback/upload", form)).data;
  },
};

