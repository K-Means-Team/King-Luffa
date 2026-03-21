/**
 * Socket.io client: throttled position emit, lobby/matchmaking-ready URLs, chat and game events.
 */

import { io } from "socket.io-client";
import { apiUrl, wsUrl } from "../config";

const EMIT_INTERVAL_MS = 1200;

export function createDefaultSocket(token) {
  return io(wsUrl, { transports: ["websocket", "polling"], auth: { token } });
}

export function createNamespacedSocket(nsPath, token) {
  const base = wsUrl.replace(/\/$/, "");
  const path = nsPath.startsWith("/") ? nsPath : `/${nsPath}`;
  return io(`${base}${path}`, { transports: ["websocket", "polling"], auth: { token } });
}

export function attachGameHandlers(socket, handlers) {
  const { onChat, onPlayers, onHill, onPoints, onBuffs, onMessage } = handlers;

  const handler = (payload) => {
    if (payload?.type === "chat" && onChat) onChat(payload);
    else if (payload?.type === "players" && onPlayers) onPlayers(payload);
    else if (payload?.type === "hill" && onHill) onHill(payload);
    else if (payload?.type === "points" && onPoints) onPoints(payload);
    else if (payload?.type === "buffs" && onBuffs) onBuffs(payload);
    else if (onMessage) onMessage(payload);
  };

  socket.on("message", handler);
  socket.on("game", handler);

  return () => {
    socket.off("message", handler);
    socket.off("game", handler);
  };
}

export function createThrottledPositionEmitter(socket) {
  let last = 0;
  let pending = null;
  let timer = null;

  const flush = () => {
    timer = null;
    if (pending == null) return;
    const { lng, lat, userId, captured } = pending;
    pending = null;
    socket.emit("message", {
      type: "position",
      lng,
      lat,
      userId,
      captured,
    });
  };

  return {
    emitPosition(lng, lat, userId, captured) {
      const now = Date.now();
      pending = { lng, lat, userId, captured };
      if (now - last >= EMIT_INTERVAL_MS) {
        last = now;
        flush();
        return;
      }
      if (!timer) {
        timer = setTimeout(() => {
          last = Date.now();
          flush();
        }, EMIT_INTERVAL_MS - (now - last));
      }
    },
    dispose() {
      if (timer) clearTimeout(timer);
      timer = null;
      pending = null;
    },
  };
}

export function emitChat(socket, text, userId) {
  socket.emit("message", { type: "chat", content: text, userId });
}
