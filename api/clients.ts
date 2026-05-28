// api/client.ts
import axios from "axios";

const API_URL = "http://localhost:9000"; // CHANGE LATER

const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
});

export default api;
