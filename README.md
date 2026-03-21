# King Luffa

Real-time King of the Hill frontend: React + Mapbox, Turf zones, Socket.io. Runs in **Luffa SuperBox** as a mini program whose single page is a [web-view](https://luffa.im/SuperBox/docs/en/miniProDevelopmentGuide/Components/openCapabilities.html) loading packaged H5 from the **`script/`** directory.

## SuperBox (Luffa Cloud IDE)

1. Copy `.env.example` to `.env` and set `VITE_MAPBOX_ACCESS_TOKEN`, API URLs, etc.
2. `npm install`
3. `npm run build:superbox` — writes the production bundle to **`script/`** (relative asset paths for offline use).
4. Open **this project root** in Luffa Cloud developer tools ([mini program intro](https://luffa.im/SuperBox/docs/en/miniProDevelopmentGuide/Introduction.html)).
5. Set your **`appid`** in `project.config.json` when the console provides one.
6. Whitelist any remote domains (Mapbox tiles, API, WebSocket) in the mini program management backend per Luffa rules.

`app.json` registers `"staticPath": ["script"]` so `/script/index.html` resolves to the on-disk `script` folder. The shell page is `pages/king-luffa/` (full-screen `web-view`).

## Local web only

- `npm run dev` — Vite dev server (default `base: '/'`, not the SuperBox layout).
- `npm run build` — output to `dist/` for normal static hosting.

## Docs

- [MEMORY.md](./MEMORY.md) — structure and data flow  
- [CHANGELOG.md](./CHANGELOG.md)

## Backend

[LuffaKing_Backend](https://github.com/K-Means-Team/LuffaKing_Backend) — session and Socket.io.

### Generating a JWT for local dev

To connect to the backend, paste a valid JWT as the **user token** on the login screen. Generate one with:

```bash
node scripts/generate-jwt.js
```

For production secrets, set env vars (or export from the backend `.env`):

```bash
export JWT_REFRESH_SECRET=your_refresh_token_secret_key_here_change_in_production
export JWT_ISSUER=LuffaDevApp
export JWT_AUDIENCE=LuffaUsers
node scripts/generate-jwt.js
```

Options:
- `--type=access` — sign with `JWT_ACCESS_SECRET` instead of refresh secret
- `--sub=user-123` — custom subject (user ID)
