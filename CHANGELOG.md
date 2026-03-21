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
