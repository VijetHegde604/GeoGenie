import qs from "qs";
import api from "./clients";

export const ChatAPI = {
  chatAboutPlace: async (placeName: string, userMessage: string) => {
    const payload = qs.stringify({
      name: placeName,
      user_message: userMessage,
    });

    console.log("➡️ Sending chat payload:", payload);

    const res = await api.post("/chat/place", payload, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    console.log("⬅️ Chat response:", res.data);

    return res.data?.ai_response?.text || "No response.";
  },
};
