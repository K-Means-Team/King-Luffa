# King Luffa — Project Memory

## Purpose

React + Mapbox GL frontend for King Luffa (King of the Hill) inside SuperBox/Luffa web-view. Location from Luffa/wx APIs only; Turf.js for hill zones; Socket.io for sync.

## SuperBox packaging

The Luffa mini program shell lives at the repo root (`app.json`, `project.config.json`, `pages/king-luffa/`). Offline H5 is emitted into **`script/`** (see [web-view staticPath](https://luffa.im/SuperBox/docs/en/miniProDevelopmentGuide/Components/openCapabilities.html)): `app.json` lists `"staticPath": ["script"]`, and the page uses `<web-view src="/script/index.html">`. Run **`npm run build:superbox`** (sets `SUPERBOX=1`) so Vite builds with `base: './'` and `outDir: 'script'`. Open this folder in Luffa Cloud IDE; set `appid` in `project.config.json` when you have one.

## Structure

| Path | Role |
|------|------|
| `src/main.jsx` | React root, global styles import |
| `src/config.js` | Central env (no import.meta); Vite define or `window.__KING_LUFFA_ENV__` |
| `src/App.jsx` | Session gate, map + overlay, game state wiring |
| `src/index.css` | Dark theme tokens (purple/indigo), layout resets |
| `src/context/AuthContext.jsx` | Session from `POST /api/session`, exposes user/session |
| `src/services/authService.js` | REST session init |
| `src/services/geolocationService.js` | Luffa `watchPosition` or `wx.getLocation` polling; dev mock without wx |
| `src/services/socketService.js` | Socket.io client, throttled `position` emit, chat/zone handlers |
| `src/services/zoneService.js` | Turf buffer + `booleanPointInPolygon` |
| `src/hooks/useGeolocation.js` | Subscribes to geolocation service |
| `src/hooks/useMapMarkers.js` | Throttles coords for map follow (no full map remount) |
| `src/hooks/useZoneCapture.js` | Grace period (2.5s) inside hill before `captured` |
| `src/components/MapView.jsx` | Mapbox map, hill layer, player markers |
| `src/components/PlayerMarker.jsx` | Circle (self) / red diamond (others) |
| `src/components/GameOverlay.jsx` | HUD shell |
| `src/components/CountdownTimer.jsx` | 1h countdown |
| `src/components/BuffsDebuffs.jsx` | Active buff list |
| `src/components/ChatLog.jsx` | Transparent log + Send |
| `src/components/ProfileButton.jsx` | Opens sidebar |
| `src/components/Points.jsx` | Score display |
| `src/components/AccountSidebar.jsx` | Account panel |

## Data flow

1. User enters token → `authService.initSession` → `AuthContext` holds session.
2. `geolocationService` streams `{ lng, lat }` → `useGeolocation` → `App` state.
3. `zoneService` builds hill polygon from server center + radius → `useZoneCapture` compares position each tick.
4. `socketService` emits throttled positions; receives `players`, `hill`, `chat`, `points`.
5. `MapView` receives `userPosition`, `otherPlayers`, `hillGeoJson`; markers update `longitude`/`latitude` only.

## Environment

Values read from `src/config.js`, which uses Vite `define` at build time or `window.__KING_LUFFA_ENV__` when served outside Vite (e.g. Luffa web-view).

- `VITE_MAPBOX_ACCESS_TOKEN` — Mapbox token (required for map tiles).
- `VITE_API_URL` — REST base (default `http://localhost:3000`).
- `VITE_WS_URL` — Socket.io URL (default same as API).

## Backend alignment

- Session: `POST /api/session` body `{ userToken }` (see LuffaKing_Backend).
- Socket: default namespace; optional paths `/lobby`, `/matchmaking-{id}` when server adds them.
