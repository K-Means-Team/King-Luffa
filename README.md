# King Luffa

## Overview

King Luffa is a real-time King of the Hill mini-game built for SuperBox using Luffa. The app projects a live battlefield onto MapBox, using spatial calculations for immediate feedback and WebSockets for state synchronization.

## Tech Stack

- **Framework:** React
- **Maps:** MapBox
- **Geolocation:** Luffa JSSDK (Mandatory: Do not use standard `navigator.geolocation`)
- **Spatial Math:** Turf.js
- **Network:** WebSockets & REST APIs

## Endpoints

- `POST /api/auth` - Login/Logout
- `WS /api/lobby` - Lobby matchmaking and connections
- `WS /api/matchmaking-[lobbyId]` - Syncs live GPS positions and Zone ownership

## Core Mechanics & Tasks

1. **Map & Tracking:** Initialize MapBoxGL - Track user location exclusively via Luffa's [JSSDK](https://luffa.im/SuperBox/docs/en/smallGame/API/location.html) -> `wx.getLocation(Object object)`
2. **Zone Logic:** Use Turf.js to generate circular buffers around the point coordinates sent from the matchmaking socket. Use `booleanPointInPolygon` to determine if the local user is inside the hill.
3. **Optimizations:** - Throttle WebSocket emissions to balance accuracy with battery life.

- Mitigate "GPS Drift" by requiring a user to be inside the Turf.js polygon for a continuous grace period (e.g., 2-3 seconds) before registering a capture state.
     - The longer the user holds the hill, the more points they collect.
     - If there are 2 (or n/5 if more players exist) players in the points devided between them.
     - If there are 3 (or n/3 if more players exist) the hill is destoried.
- Do not re-render the entire map on GPS ticks; update marker positions dynamically.

## Powerups and Buffs

Powerups and buffs are disrebuted throughout the map. However, some buffs are given to certain groups of players depending on the leaderboard of points. Players who are last will be given buffs/powerups more often compared to people in the top 5. Guardrails are in place to prevent abuse from hoarding powerups and buffs by adding durations to buffs and "effective output" to powerups.

1. **Bomb:** The bomb powerup with spawn randomly in the area. If collected, the player can set it off to:
      - Stun Players outside hills (outside of hill zones)
      - Steal points from players in hill (inside hill zones)
      - Destory hills (requires 3 bombs and needs to be inside the hill zone)
2. **Luck:** The Luck Buff is given to those who are last. This will increase the chance a hill zone will spawn near the players location or a powerup spawning.
      - Will last for 5/10/15 secs depending on the gap between last and first place.
