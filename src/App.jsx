/**
 * Root app: session gate, socket + geolocation wiring, map and HUD integration.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { GameOverlay } from "./components/GameOverlay";
import { MapView } from "./components/MapView";
import { useGeolocation } from "./hooks/useGeolocation";
import { useMapMarkers } from "./hooks/useMapMarkers";
import { useZoneCapture } from "./hooks/useZoneCapture";
import { hillPolygonFromCenter } from "./services/zoneService";
import {
  attachGameHandlers,
  createDefaultSocket,
  createThrottledPositionEmitter,
  emitChat,
} from "./services/socketService";

let msgId = 0;
function nextMsgId() {
  msgId += 1;
  return `m-${msgId}`;
}

function LoginScreen() {
  const { login, loading, error, clearError } = useAuth();
  const [token, setToken] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    clearError();
    await login(token.trim());
  };

  return (
    <div className="login-screen">
      <h1 className="login-screen__title">King Luffa</h1>
      <form className="login-screen__form" onSubmit={onSubmit}>
        <label className="login-screen__label">
          User token
          <input
            className="login-screen__input"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            autoComplete="off"
            placeholder="Paste token"
          />
        </label>
        <button type="submit" className="login-screen__submit" disabled={loading || !token.trim()}>
          {loading ? "Connecting…" : "Enter"}
        </button>
        {error ? <p className="login-screen__error">{error}</p> : null}
      </form>
    </div>
  );
}

function GameScreen() {
  const { session, logout } = useAuth();
  const { position } = useGeolocation();
  const mapPosition = useMapMarkers(position);
  const [hillMeta, setHillMeta] = useState(null);
  const [otherPlayers, setOtherPlayers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [points, setPoints] = useState(0);
  const [buffs, setBuffs] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const socketRef = useRef(null);
  const throttledEmitRef = useRef(null);
  const detachHandlersRef = useRef(null);

  const demoHill = useMemo(() => {
    if (hillMeta) return hillMeta;
    if (!mapPosition || mapPosition.lng == null || mapPosition.lat == null) return null;
    return { lng: mapPosition.lng, lat: mapPosition.lat, radiusMeters: 85 };
  }, [hillMeta, mapPosition]);

  const hillPolygon = useMemo(() => {
    if (!demoHill) return null;
    return hillPolygonFromCenter(demoHill.lng, demoHill.lat, demoHill.radiusMeters);
  }, [demoHill]);

  const captured = useZoneCapture(position, hillPolygon);

  useEffect(() => {
    if (!session) return;
    const socket = createDefaultSocket();
    socketRef.current = socket;
    throttledEmitRef.current = createThrottledPositionEmitter(socket);

    const detach = attachGameHandlers(socket, {
      onChat: (p) =>
        setMessages((prev) => [
          ...prev,
          {
            id: nextMsgId(),
            who: String(p.userId ?? p.from ?? "player"),
            text: String(p.content ?? ""),
          },
        ]),
      onPlayers: (p) => {
        const list = p.players ?? p.data ?? [];
        const selfId = session?.sessionId || session?.userToken;
        setOtherPlayers(
          list
            .map((pl, i) => ({
              id: pl.id ?? pl.userId ?? `p-${i}`,
              lng: pl.lng ?? pl.longitude,
              lat: pl.lat ?? pl.latitude,
            }))
            .filter((pl) => pl.id !== selfId)
        );
      },
      onHill: (p) => {
        const lng = p.lng ?? p.longitude;
        const lat = p.lat ?? p.latitude;
        const radiusMeters = p.radiusMeters ?? p.radius ?? 80;
        if (lng != null && lat != null) setHillMeta({ lng, lat, radiusMeters });
      },
      onPoints: (p) => setPoints(Number(p.value ?? p.points ?? 0)),
      onBuffs: (p) => setBuffs(p.items ?? []),
    });
    detachHandlersRef.current = detach;

    socket.connect();

    return () => {
      detach?.();
      detachHandlersRef.current = null;
      throttledEmitRef.current?.dispose();
      throttledEmitRef.current = null;
      socket.disconnect();
      socketRef.current = null;
    };
  }, [session]);

  useEffect(() => {
    if (!session || !position || position.lng == null || position.lat == null) return;
    const te = throttledEmitRef.current;
    if (!te) return;
    const uid = session.sessionId || session.userToken || "local";
    te.emitPosition(position.lng, position.lat, uid, captured);
  }, [position, captured, session]);

  const onChatSend = useCallback(
    (text) => {
      const sock = socketRef.current;
      if (!sock) return;
      const uid = session?.sessionId || session?.userToken || "local";
      emitChat(sock, text, uid);
      setMessages((prev) => [...prev, { id: nextMsgId(), who: "You", text }]);
    },
    [session]
  );

  const onLogout = useCallback(async () => {
    setSidebarOpen(false);
    await logout();
  }, [logout]);

  return (
    <div className="app-game">
      <div className="app-game__map">
        <MapView userPosition={mapPosition} otherPlayers={otherPlayers} hillPolygon={hillPolygon} />
      </div>
      <GameOverlay
        buffs={buffs}
        messages={messages}
        onChatSend={onChatSend}
        points={points}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        session={session}
        onLogout={onLogout}
      />
      {captured ? <div className="capture-badge" aria-live="polite">On the hill</div> : null}
    </div>
  );
}

export default function App() {
  const { session } = useAuth();
  return session ? <GameScreen /> : <LoginScreen />;
}
