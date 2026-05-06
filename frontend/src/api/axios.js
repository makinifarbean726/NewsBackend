import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
});

// ✅ attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  const url = config.url || "";

  // ❌ NEVER attach token to auth routes
  const isAuthRoute =
    url.includes("/auth/login") ||
    url.includes("/auth/register");

  if (token && !isAuthRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;