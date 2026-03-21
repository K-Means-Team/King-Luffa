import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const superbox = process.env.SUPERBOX === "1";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    server: { port: 5173 },
    base: superbox ? "./" : "/",
    build: {
      outDir: superbox ? "script" : "dist",
      emptyOutDir: true,
    },
    define: {
      __APP_API_URL__: JSON.stringify(env.VITE_API_URL || "http://localhost:3000"),
      __APP_WS_URL__: JSON.stringify(
        env.VITE_WS_URL || env.VITE_API_URL || "http://localhost:3000"
      ),
      __APP_MAPBOX_TOKEN__: JSON.stringify(env.VITE_MAPBOX_ACCESS_TOKEN || ""),
      __APP_DEV__: JSON.stringify(mode === "development"),
    },
  };
});
