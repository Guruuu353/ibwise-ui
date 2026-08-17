import axios from "axios";

// Single axios instance — every module imports this instead of configuring
// its own baseURL/interceptors. Swap VITE_API_URL in .env when the backend
// moves (local -> Railway staging -> Railway production).
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ibwise_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Uploaded files (lessons, assignment attachments, submissions) come back
// as relative "/uploads/xyz" paths from the API — resolve them against the
// API's origin (not the frontend's) so links/previews work in every env.
export function resolveFileUrl(url) {
  if (!url) return url;
  if (url.startsWith("http")) return url;
  const base = (import.meta.env.VITE_API_URL || "/api").replace(/\/api\/?$/, "");
  return `${base}${url}`;
}

api.interceptors.response.use(
  (res) => res.data?.data ?? res.data,
  (err) => {
    const message = err.response?.data?.message || "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);
