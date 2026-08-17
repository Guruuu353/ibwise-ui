import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Frontend on Vercel, API on Railway (per project convention) — the dev
// proxy below just saves setting VITE_API_URL locally.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": { target: "http://localhost:4000", changeOrigin: true },
      "/uploads": { target: "http://localhost:4000", changeOrigin: true },
    },
  },
});
