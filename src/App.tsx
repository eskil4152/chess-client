import React from "react";
import { Routes, Route } from "react-router-dom";
import "./styles/App.css";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Index from "./pages/Index";
import Play from "./pages/games/Play";
import PlayBot from "./pages/games/PlayBot";
import Game from "./pages/games/Game";
import User from "./pages/user/User";
import GameHistory from "./pages/user/GameHistory";
import GameReplay from "./pages/games/GameReplay";
import LockedRoute from "./components/LockedRoute";
import WebSocketProvider from "./providers/WebSocketProvider";
import Friends from "./pages/friends/Friends";
import Leaderboard from "./pages/Leaderboard";
import ServerOffline from "./pages/ServerOffline";

function App() {
  return (
    <>
      <Routes>
        <Route path="/server-offline" element={<ServerOffline />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<LockedRoute />}>
          <Route element={<WebSocketProvider />}>
            <Route path="/" element={<Index />} />
            <Route path="/play" element={<Play />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/play/bot/:difficulty" element={<PlayBot />} />
            <Route path="/game" element={<Game />} />
            <Route path="/game/:gameId" element={<Game />} />
            <Route path="/user" element={<User />} />
            <Route path="/games/user" element={<GameHistory />} />
            <Route path="/games/:id" element={<GameReplay />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
