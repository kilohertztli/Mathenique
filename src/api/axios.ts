import axios from "axios";

const api = axios.create({
  baseURL: "https://mathenique.onrender.com/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("mathquest_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
