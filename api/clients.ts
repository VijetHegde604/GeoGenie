// api/client.ts
import axios from 'axios';

const API_URL = 'http://100.88.203.122:8000'; // CHANGE LATER

const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
});

export default api;