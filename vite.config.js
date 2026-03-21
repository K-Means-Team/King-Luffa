import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const superbox = process.env.SUPERBOX === "1";

/** For SuperBox: classic script (no type=module) + move to end of body so root exists before createRoot */
function superboxHtmlPlugin() {
  if (!superbox) return null;
  return {
    name: "superbox-html",
    transformIndexHtml(html) {
      // Remove type="module" from main script
      let out = html.replace(
        /<script([^>]*)\stype="module"([^>]*)>/g,
        "<script$1$2>"
      );
      // Move main app script from head to end of body (classic script runs immediately; root must exist)
      const scriptMatch = out.match(
        /<script\s+crossorigin[^>]*src="([^"]+)"[^>]*><\/script>/
      );
      if (scriptMatch) {
        const [, src] = scriptMatch;
        out = out.replace(scriptMatch[0], "");
        out = out.replace("</body>", `  <script crossorigin src="${src}"></script>\n</body>`);
      }
      return out;
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const define = {
    __APP_API_URL__: JSON.stringify(env.VITE_API_URL || "http://localhost:3000"),
    __APP_WS_URL__: JSON.stringify(
      env.VITE_WS_URL || env.VITE_API_URL || "http://localhost:3000"
    ),
    __APP_MAPBOX_TOKEN__: JSON.stringify(env.VITE_MAPBOX_ACCESS_TOKEN || ""),
    __APP_DEV__: JSON.stringify(mode === "development"),
  };
  return {
    plugins: [react(), superboxHtmlPlugin()].filter(Boolean),
    server: { port: 5173 },
    base: superbox ? "./" : "/",
    build: {
      outDir: superbox ? "script" : "dist",
      emptyOutDir: true,
      ...(superbox
        ? {
            rollupOptions: {
              output: {
                format: "iife",
                inlineDynamicImports: true,
              },
            },
          }
        : {}),
    },
    define,
  };
});
