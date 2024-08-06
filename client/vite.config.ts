import path from "path";
import dotenv from "dotenv";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

dotenv.config();

const { PORT = 3000 } = process.env;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    watch: {
      usePolling: true,
    },
    host: "0.0.0.0",
    strictPort: true,
    port: Number(PORT),
  },
});
