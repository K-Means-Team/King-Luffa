# Changelog

## [1.0.0] — 2026-03-20

- Replaced legacy canvas mini-game with Vite + React King Luffa frontend.
- Added Mapbox map, Luffa/wx geolocation abstraction, Turf hill zones with capture grace period.
- Added Socket.io client with throttled position emissions and chat/points/hill event hooks.
- Added HUD: countdown, buffs, chat, profile sidebar, points; dark purple/indigo theme.
- Added `MEMORY.md` and session auth via `POST /api/session`.

## [1.0.1] — 2026-03-21

- Introduced `src/config.js` to remove `import.meta` usage for Luffa web-view and static-serve compatibility.
- Auth, socket, geolocation, and MapView now read env from config; Vite `define` injects values at build time.

## [1.1.0] — 2026-03-21

- Added SuperBox mini program shell: `app.json` with `staticPath: ["script"]`, `pages/king-luffa/` web-view pointing at `/script/index.html`, `project.config.json`, `app.js`.
- `npm run build:superbox` runs Vite with `SUPERBOX=1` (output `script/`, relative `base` for offline assets).

## [1.1.1] — 2026-03-21

- Replaced `pages/king-luffa/index.wxml` with **`index.qml`** so LuffaTools mini program upload finds the page template.
- Removed `game.json` (mini game config); project is a mini program and Luffa IDE errors when it finds game.json.

## [1.1.2] — 2026-03-21

- Created a multi-screen routing setup in `App.jsx` (Welcome -> Lobby -> Matchmaking -> Game).
- Added premium `WelcomeScreen.jsx`, `LobbyScreen.jsx`, and `MatchmakingScreen.jsx` UI components.
- Fixed Map chat UI: the input is always visible, but the log fades away on 5-second inactivity. Handled repositioning of Chat to bottom-left and Profile button to top-left.
- Fixed Sidebar tap-to-close behavior by ensuring the backdrop element is actionable and adding an explicit close button.
- Added `/api/match/mock` backend route to simulate fake matches and test Turf.js functionality.
