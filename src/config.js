/**
 * Central env config; avoids import.meta for compatibility with Luffa web-view and static serve.
 * Vite define injects values at build time; otherwise falls back to window.__KING_LUFFA_ENV__ or defaults.
 */

function getEnv() {
  if (typeof __APP_API_URL__ !== "undefined") {
    return {
      apiUrl: __APP_API_URL__,
      wsUrl: __APP_WS_URL__,
      mapboxToken: __APP_MAPBOX_TOKEN__,
      dev: __APP_DEV__ === "true",
    };
  }
  const w = typeof window !== "undefined" && window.__KING_LUFFA_ENV__;
  return {
    apiUrl: w?.VITE_API_URL || "http://localhost:3000",
    wsUrl: w?.VITE_WS_URL || w?.VITE_API_URL || "http://localhost:3000",
    mapboxToken: w?.VITE_MAPBOX_ACCESS_TOKEN || "",
    dev: false,
  };
}

const env = getEnv();
export const apiUrl = env.apiUrl;
export const wsUrl = env.wsUrl;
export const mapboxToken = env.mapboxToken;
export const isDev = env.dev;
