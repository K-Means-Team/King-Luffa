### REST API Endpoints (HTTP)

1. **Initialize Session**
   - **Method:** `POST`
   - **Endpoint:** `/api/session`
   - **Purpose:** Authenticates the user and sets up the game session.
   - **Request Body:** `{ "userToken": "string" }`
   - **Expected Response:** `{ "data": { "sessionId": "string", "accessToken": "string", "user": { "name": "string" } } }`

2. **Logout**
   - **Method:** `POST`
   - **Endpoint:** `/api/session/logout`
   - **Purpose:** Terminates the active session.
   - **Headers:** `Authorization: Bearer <accessToken>`
   - **Expected Response:** `200 OK`

---

### WebSocket Events (Socket.io)

The application relies heavily on WebSockets for real-time game state synchronization.

#### Events Emitted by the Client (Server needs to listen for these):
1. **`position`**
   - **Purpose:** Throttled location updates sent by the player (roughly every 2.5 seconds).
   - **Payload:** [(longitude: number, latitude: number, userId: string, capturedHill: boolean)](cci:1://file:///Volumes/Temp%20Drive/Mini-Program/src/App.jsx:153:0-167:1)
   - **Action:** The server should update the player's position in memory and award points/triggers if `capturedHill` is true.
2. **`chat`**
   - **Purpose:** A player sending a message to the lobby/match.
   - **Payload:** `{ "content": "string", "userId": "string" }`

#### Events Emitted by the Server (Client listens for these):
1. **`players`** (or `data`)
   - **Purpose:** Broadcasts the positions of all active players in the match.
   - **Payload Structure Expected:** An object containing an array of players: `{ "players": [{ "id": "string", "lng": number, "lat": number }] }`
2. **`hill`**
   - **Purpose:** Broadcasts the current "King of the Hill" target zone.
   - **Payload Structure Expected:** `{ "lng": number, "lat": number, "radiusMeters": number }`
3. **`chat`**
   - **Purpose:** Broadcasts new chat messages to the lobby/map.
   - **Payload Structure Expected:** `{ "userId": "string", "content": "string" }`
4. **`points`**
   - **Purpose:** Updates the user's current score.
   - **Payload Structure Expected:** `{ "value": number }`
5. **`buffs`**
   - **Purpose:** (Optional) Pushes active buffs/debuffs to display on the user's HUD.
   - **Payload Structure Expected:** `{ "items": [{ "id": "string", "label": "string", "type": "buff|debuff" }] }`

*(Note: Currently, the frontend transitions from [Matchmaking](cci:1://file:///Volumes/Temp%20Drive/Mini-Program/src/components/MatchmakingScreen.jsx:2:0-27:1) to [GameScreen](cci:1://file:///Volumes/Temp%20Drive/Mini-Program/src/App.jsx:29:0-151:1) using a simulated 3-second delay. If you want true server-side matchmaking, you would eventually also need a `POST /api/matchmaking` endpoint or a `join_queue` WebSocket event.)*