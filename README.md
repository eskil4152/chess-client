# Chess Client

A real-time multiplayer chess frontend built with React and TypeScript.
Full chess gameplay in the browser: drag-and-drop moves, live clocks, WebSocket-driven game events, bot opponents, player challenges, friends management, profile pages, and game history —
all backed by the [Chess](../chess) Spring Boot server.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Features](#features)
    - [Authentication & Server Detection](#authentication--server-detection)
    - [WebSocket & Real-Time Connection](#websocket--real-time-connection)
    - [Matchmaking & Time Controls](#matchmaking--time-controls)
    - [Bot Opponents](#bot-opponents)
    - [Challenges](#challenges)
    - [Board & Game Display](#board--game-display)
    - [Sound Effects](#sound-effects)
    - [Game Controls](#game-controls)
    - [Friends](#friends)
    - [Profiles](#profiles)
    - [Game History](#game-history)
- [Pages & Routing](#pages--routing)
- [Configuration](#configuration)

---

## Tech Stack

| Layer       | Technology                               |
|-------------|------------------------------------------|
| Language    | TypeScript                               |
| Framework   | React 19                                 |
| Routing     | React Router v7                          |
| Chess Board | react-chessboard                         |
| Chess Logic | chess.js (local move validation/display) |
| Styling     | Plain CSS                                |
| Build       | Create React App (react-scripts)         |

---

## Architecture

The app is structured around three React context providers that wrap all authenticated routes:

- **`AuthProvider`** — bootstraps auth state on load by calling `GET /api/auth`. Stores the session in `sessionStorage` for fast re-hydration across page refreshes. Redirects to `/server-offline` if the server is unreachable, and to `/login` if the session is invalid.
- **`WebSocketProvider`** — owns the single WebSocket connection to the server. Implements exponential-backoff reconnection (up to 30 s), exposes `sendJson` and a `subscribe` listener model so any component can react to server events without prop drilling. Sends a client-side `PING` frame every 20 seconds to mirror the server's keep-alive.
- **`ChallengeProvider`** — sits inside `WebSocketProvider` and manages the full challenge lifecycle (incoming, outgoing, accept/decline/cancel/expire) by subscribing to the WebSocket stream. Renders the `ChallengeOverlay` globally so challenge notifications appear on any page.

Unauthenticated routes (`/login`, `/register`, `/server-offline`) render outside the providers. All other routes are gated by `LockedRoute`, which redirects unauthenticated users to `/login`.

---

## Features

### Authentication & Server Detection

- Registration and login via username and password; the server issues an `HttpOnly` JWT cookie that is sent automatically with every request.
- On startup, `AuthProvider` calls `GET /api/auth` to verify the session. The result is cached in `sessionStorage` so the UI restores instantly on refresh without a loading flash.
- If the server is unreachable at startup, the app redirects to `/server-offline` and polls `GET /api/auth` with exponential backoff until the server responds.

---

### WebSocket & Real-Time Connection

- A single persistent WebSocket connection is established for all authenticated pages and shared via `WebSocketContext`.
- Reconnection uses exponential backoff starting at 500 ms, doubling each attempt, capped at 30 seconds.
- Connection status (connected / disconnected) is shown as a status bar across the top of the page.
- On a 401 `ERROR` event from the server, the client navigates to `/login`.
- On a `GAME_STARTED` event, the client navigates to `/game` automatically.

---

### Matchmaking & Time Controls

- Players choose a time control and join the matchmaking queue; the server pairs them with the closest Elo match within a 200-point window.
- The queue page polls for a match in the background; once found, the WebSocket `GAME_STARTED` event triggers automatic navigation to the game.

**Supported time controls**

| Category | Display  | Initial | Increment |
|----------|----------|---------|-----------|
| Bullet   | 1+0      | 1 min   | 0 s       |
| Bullet   | 1+1      | 1 min   | 1 s       |
| Bullet   | 2+0      | 2 min   | 0 s       |
| Blitz    | 3+0      | 3 min   | 0 s       |
| Blitz    | 3+2      | 3 min   | 2 s       |
| Blitz    | 5+0      | 5 min   | 0 s       |
| Rapid    | 10+0     | 10 min  | 0 s       |
| Rapid    | 10+5     | 10 min  | 5 s       |
| Rapid    | 15+0     | 15 min  | 0 s       |
| Rapid    | 15+10    | 15 min  | 10 s      |
| Rapid    | 30+0     | 30 min  | 0 s       |
| Rapid    | 60+0     | 60 min  | 0 s       |

---

### Bot Opponents

- Players can start a game against the server's built-in minimax bot at three difficulty levels: Easy, Medium, or Hard.

---

### Challenges

The `ChallengeProvider` handles the full challenge flow over WebSocket:

| Event                 | Direction       | Description                                             |
|-----------------------|-----------------|---------------------------------------------------------|
| `CHALLENGE`           | Client → Server | Send a challenge with a chosen time control             |
| `CHALLENGE_RESPONSE`  | Client → Server | Accept or decline an incoming challenge                 |
| `CANCEL_CHALLENGE`    | Client → Server | Cancel a pending outgoing challenge                     |
| `CHALLENGE`           | Server → Client | Received by the challenged player; triggers the overlay |
| `CHALLENGE_DECLINED`  | Server → Client | Clears the outgoing challenge state for the challenger  |
| `CHALLENGE_CANCELLED` | Server → Client | Dismisses the incoming challenge overlay                |
| `CHALLENGE_EXPIRED`   | Server → Client | Clears both sides when the challenge times out          |

- An incoming challenge plays a sound and shows a modal overlay on any page.
- An outgoing challenge shows a pending indicator with a cancel button.

---

### Board & Game Display

- Board orientation follows your color (white pieces at the bottom, black at the top).
- Drag-and-drop and click-to-select-then-click move interaction via `react-chessboard`.
- `chess.js` is used client-side to validate moves locally before sending to the server, and to generate legal move highlights.
- Visual cues:
  - Last move highlighted in green
  - Selected piece highlighted in yellow
  - King highlighted in red when in check
  - Piece origin shown while dragging
- Countdown clocks for both players, showing minutes and seconds.
- Elo ratings for both players displayed on the game screen; the rating change is shown after the game ends.

---

### Sound Effects

Distinct audio cues play for each game event:

| Event              | Sound file         |
|--------------------|--------------------|
| Move               | `Move.mp3`         |
| Capture            | `Capture.mp3`      |
| Check              | `Check.mp3`        |
| Checkmate          | `Checkmate.mp3`    |
| Win                | `Victory.mp3`      |
| Loss               | `Defeat.mp3`       |
| Draw               | `Draw.mp3`         |
| Error              | `Error.mp3`        |
| Incoming challenge | `NewChallenge.mp3` |

---

### Game Controls

- **Offer draw** — sends `OFFER_DRAW` over WebSocket; the game ends when both players have offered.
- **Accept draw** — responds to an incoming draw offer displayed on the game screen.
- **Resign** — sends `RESIGN` over WebSocket; forfeits the game immediately.
- The header shows a link back to `/game` if the user has an active game, accessible from any page.

---

### Friends

- Search for any player by username.
- Add and remove friends.
- View the full friends list with avatars and usernames.
- Challenge a friend directly from the friends list with a chosen time control.

---

### Profiles

- View any player's profile: avatar, username, Elo rating, and bio.
- Edit your own avatar (by URL), bio, and password from your profile page.
- Add or remove a friend directly from their profile page.
- Link through to a player's full game history from their profile.

---

### Game History

- Full game history for any player, paginated as a list of game cards.
- Each entry shows both players, the result (WIN / LOSS / DRAW), and links to each player's profile.

---

## Pages & Routing

| Path                    | Component     | Description                          |
|-------------------------|---------------|--------------------------------------|
| `/login`                | Login         | Log in with username and password    |
| `/register`             | Register      | Create a new account                 |
| `/server-offline`       | ServerOffline | Shown when the server is unreachable |
| `/`                     | Index         | Home / dashboard                     |
| `/play`                 | Play          | Join the matchmaking queue           |
| `/play/select`          | PlaySelect    | Choose a time control before queuing |
| `/play/bot/:difficulty` | PlayBot       | Start a game against a bot           |
| `/game`                 | Game          | Active game board                    |
| `/friends`              | Friends       | Friends list and challenge           |
| `/user`                 | User          | User profile (own or any player)     |
| `/games/user`           | GameHistory   | Game history for a player            |

All routes except `/login`, `/register`, and `/server-offline` require authentication (`LockedRoute`).

---

## Configuration

The app reads two environment variables at build time:

| Variable       | Description                                                      |
|----------------|------------------------------------------------------------------|
| `VITE_API_URL` | Base URL for the REST API (e.g. `http://localhost:8080`)         |
| `VITE_WS_URL`  | Base URL for the WebSocket endpoint (e.g. `ws://localhost:8080`) |

Set these in a `.env` file at the project root for local development:

```
VITE_API_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080
```