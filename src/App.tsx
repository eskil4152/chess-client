import React from "react";
import { Routes, Route } from "react-router-dom";
import "./styles/App.css";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Index from "./pages/Index";
import Play from "./pages/games/Play";
import PlayBot from "./pages/games/PlayBot";
import PlaySelect from "./pages/games/PlaySelect";
import Game from "./pages/games/Game";
import User from "./pages/user/User";
import GameHistory from "./pages/user/GameHistory";
import Header from "./components/Header";
import LockedRoute from "./components/LockedRoute";
import WebSocketProvider from "./providers/WebSocketProvider";
import Friends from "./pages/friends/Friends";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<LockedRoute />}>
          <Route element={<WebSocketProvider />}>
            <Route path="/" element={<Index />} />
            <Route path="/play" element={<Play />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/play/select" element={<PlaySelect />} />
            <Route path="/play/bot/:difficulty" element={<PlayBot />} />
            <Route path="/game" element={<Game />} />
            <Route path="/user" element={<User />} />
            <Route path="/games/user" element={<GameHistory />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
